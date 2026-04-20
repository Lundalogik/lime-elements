import React from 'react';
import { renderDescription, renderTitle } from './common';
import { ArrayFieldTemplateProps } from './types';
import { FormSchema } from '../form.types';
import Sortable, { SortableEvent } from 'sortablejs';
import { ArrayFieldContext, ArrayFieldOptions } from './array-context';

export const ARRAY_REORDER_EVENT = 'arrayReorder';

interface ArrayFieldTemplateState {
    order: number[];
}

const DRAG_HANDLE_SELECTOR = '[data-drag-handle]';
const DRAGGABLE_ITEM_SELECTOR = '.array-item[data-reorderable="true"]';
const DEFAULT_CONTAINER_CLASS = 'has-an-item-which-is-being-dragged';
const DEFAULT_DROP_ELEVATION_CLASS = 'is-elevated';
const DROP_ELEVATION_DURATION = 1000;
const TOUCH_DRAG_DELAY_MS = 200; // Adds a short hold on touch (long-press) so scroll gestures do not reorder items.

export class ArrayFieldTemplate extends React.Component<
    ArrayFieldTemplateProps,
    ArrayFieldTemplateState
> {
    private container?: HTMLDivElement;
    private sortable?: Sortable;
    private dragSnapshot?: number[];
    private draggedItemIndex?: number;
    private dropElevationTimeout?: ReturnType<typeof setTimeout>;
    private dropElevationTarget?: HTMLElement;
    private cachedContextValue: ArrayFieldOptions | null = null;
    private cachedSchema?: FormSchema;
    private cachedFormData?: any[];

    public constructor(props: ArrayFieldTemplateProps) {
        super(props);

        this.state = {
            order: this.extractIndices(props.items),
        };
    }

    public componentWillUnmount() {
        this.teardownDragController();
    }

    public componentDidMount() {
        this.setupDragController();
    }

    public componentDidUpdate(previousProps: ArrayFieldTemplateProps) {
        if (previousProps.items !== this.props.items) {
            const nextOrder = this.extractIndices(this.props.items);

            if (!this.arraysEqual(this.state.order, nextOrder)) {
                this.setState(
                    {
                        order: nextOrder,
                    },
                    () => {
                        this.setupDragController();
                    }
                );
                return;
            }
        }

        if (
            previousProps.items !== this.props.items ||
            previousProps.schema !== this.props.schema ||
            previousProps.disabled !== this.props.disabled ||
            previousProps.readonly !== this.props.readonly
        ) {
            this.setupDragController();
        }
    }

    public render() {
        const orderedItems = this.getOrderedItems();
        const contextValue = this.getContextValue();

        return React.createElement(
            ArrayFieldContext.Provider,
            { value: contextValue },
            React.createElement(
                'div',
                {},
                renderTitle(this.props.title),
                renderDescription(this.props.schema.description),
                React.createElement(
                    'div',
                    {
                        className: 'array-items',
                        ref: this.setContainer,
                    },
                    orderedItems
                ),
                this.renderAddButton()
            )
        );
    }

    private renderAddButton() {
        if (!this.props.canAdd) {
            return;
        }

        return React.createElement('limel-button', {
            label: this.props.title || 'Add',
            onClick: this.handleAddClick,
            icon: 'plus_math',
            class: 'button-add-new',
        });
    }

    private readonly handleAddClick = (event: MouseEvent) => {
        event.stopPropagation();
        this.props.onAddClick(event);
    };

    private readonly setContainer = (element: HTMLDivElement | null) => {
        if (this.container === element) {
            return;
        }

        this.teardownDragController();
        this.container = element ?? undefined;
        this.setupDragController();
    };

    private getOrderedItems(): React.ReactElement[] {
        const items = this.props.items ?? [];
        if (items.length === 0) {
            return [];
        }

        const byKey = new Map<number, React.ReactElement>();
        for (const [index, item] of items.entries()) {
            byKey.set(index, item);
        }

        const ordered: React.ReactElement[] = [];
        const used = new Set<number>();

        for (const index of this.state.order) {
            const entry = byKey.get(index);
            if (!entry) {
                continue;
            }

            ordered.push(entry);
            used.add(index);
        }

        for (const [index, entry] of byKey.entries()) {
            if (!used.has(index)) {
                ordered.push(entry);
            }
        }

        return ordered;
    }

    private readonly handleSortStart = (event: SortableEvent) => {
        if (!this.canReorderItems()) {
            return;
        }

        this.dragSnapshot = [...this.state.order];
        this.draggedItemIndex = this.getReorderId(event.item);

        if (this.container) {
            this.container.classList.add(DEFAULT_CONTAINER_CLASS);
        }

        if (event.item instanceof HTMLElement) {
            this.applyDropElevation(event.item);
        }
    };

    private readonly handleSortEnd = (event: SortableEvent) => {
        if (!this.canReorderItems()) {
            return;
        }

        if (this.container) {
            this.container.classList.remove(DEFAULT_CONTAINER_CLASS);
        }

        const snapshot = this.dragSnapshot;
        const draggedItemIndex = this.draggedItemIndex;
        this.dragSnapshot = undefined;
        this.draggedItemIndex = undefined;

        if (event.item instanceof HTMLElement) {
            this.dropElevationTarget = event.item;
        }

        const finalOrder = this.readOrderFromDom();

        if (!this.arraysEqual(this.state.order, finalOrder)) {
            this.setState({ order: finalOrder });
        }

        if (
            snapshot === undefined ||
            draggedItemIndex === undefined ||
            !(event.item instanceof HTMLElement)
        ) {
            this.scheduleDropElevationRemoval();
            return;
        }

        const fromPosition = snapshot.indexOf(draggedItemIndex);
        const toPosition = finalOrder.indexOf(draggedItemIndex);

        if (
            fromPosition === -1 ||
            toPosition === -1 ||
            fromPosition === toPosition
        ) {
            this.scheduleDropElevationRemoval();
            return;
        }

        this.container?.dispatchEvent(
            new CustomEvent(ARRAY_REORDER_EVENT, {
                bubbles: true,
                detail: { fromIndex: fromPosition, toIndex: toPosition },
            })
        );

        this.scheduleDropElevationRemoval();
    };

    private setupDragController() {
        if (!this.container || !this.canReorderItems()) {
            this.teardownDragController();
            return;
        }

        const reorderableItems = this.container.querySelectorAll(
            `:scope > ${DRAGGABLE_ITEM_SELECTOR}`
        );
        if (reorderableItems.length < 2) {
            this.teardownDragController();
            return;
        }

        if (this.sortable) {
            this.sortable.option('handle', DRAG_HANDLE_SELECTOR);
            this.sortable.option('draggable', DRAGGABLE_ITEM_SELECTOR);
            this.sortable.option('disabled', false);
            this.sortable.option('delay', TOUCH_DRAG_DELAY_MS);
            this.sortable.option('delayOnTouchOnly', true);
            return;
        }

        this.sortable = Sortable.create(this.container, {
            animation: 150,
            handle: DRAG_HANDLE_SELECTOR,
            draggable: DRAGGABLE_ITEM_SELECTOR,
            delay: TOUCH_DRAG_DELAY_MS,
            delayOnTouchOnly: true,
            onStart: this.handleSortStart,
            onEnd: this.handleSortEnd,
        });
    }

    private teardownDragController() {
        if (this.sortable) {
            this.sortable.destroy();
            this.sortable = undefined;
        }

        this.clearDropElevationTimer();

        if (this.dropElevationTarget) {
            this.dropElevationTarget.classList.remove(
                DEFAULT_DROP_ELEVATION_CLASS
            );
            this.dropElevationTarget = undefined;
        }

        if (this.container) {
            this.container.classList.remove(DEFAULT_CONTAINER_CLASS);
        }

        this.dragSnapshot = undefined;
        this.draggedItemIndex = undefined;
    }

    private canReorderItems(): boolean {
        if (this.props.disabled || this.props.readonly) {
            return false;
        }

        const schema = this.props.schema as FormSchema;
        const limeOptions = schema?.lime || {};

        return limeOptions.allowItemReorder !== false;
    }

    private readOrderFromDom(): number[] {
        if (!this.container) {
            return [];
        }

        // Only read the order of the direct children of this array field.
        // Nested array fields may render `.array-item` elements inside items,
        // and those must not affect the parent order.
        const items = [...this.container.children].filter((element) => {
            return Boolean(element?.classList?.contains?.('array-item'));
        }) as HTMLElement[];

        const order: number[] = [];

        for (const element of items) {
            const index = this.getReorderId(element);
            if (index !== undefined) {
                order.push(index);
            }
        }

        return order;
    }

    private getReorderId(element: HTMLElement | null): number | undefined {
        if (!element) {
            return undefined;
        }

        const value = element?.dataset?.reorderId;
        if (value === undefined) {
            return undefined;
        }

        const parsed = Number.parseInt(value, 10);
        return Number.isNaN(parsed) ? undefined : parsed;
    }

    private applyDropElevation(item: HTMLElement) {
        if (this.dropElevationTarget && this.dropElevationTarget !== item) {
            this.dropElevationTarget.classList.remove(
                DEFAULT_DROP_ELEVATION_CLASS
            );
        }

        this.clearDropElevationTimer();
        item.classList.add(DEFAULT_DROP_ELEVATION_CLASS);
        this.dropElevationTarget = item;
    }

    private scheduleDropElevationRemoval() {
        if (!this.dropElevationTarget) {
            return;
        }

        const target = this.dropElevationTarget;
        this.clearDropElevationTimer();
        this.dropElevationTimeout = globalThis.setTimeout(() => {
            target.classList.remove(DEFAULT_DROP_ELEVATION_CLASS);
            if (this.dropElevationTarget === target) {
                this.dropElevationTarget = undefined;
            }
            this.dropElevationTimeout = undefined;
        }, DROP_ELEVATION_DURATION);
    }

    private clearDropElevationTimer() {
        if (this.dropElevationTimeout !== undefined) {
            clearTimeout(this.dropElevationTimeout);
            this.dropElevationTimeout = undefined;
        }
    }

    private arraysEqual(a: number[], b: number[]): boolean {
        if (a.length !== b.length) {
            return false;
        }

        let index = 0;
        for (const value of a) {
            if (value !== b[index]) {
                return false;
            }
            index += 1;
        }

        return true;
    }

    private extractIndices(items: React.ReactElement[] = []): number[] {
        return (items ?? []).map((_, index) => index);
    }

    private getContextValue(): ArrayFieldOptions {
        const schema = this.props.schema as FormSchema;
        const formData = (this.props.formData ?? []) as any[];

        if (
            this.cachedContextValue &&
            this.cachedSchema === schema &&
            this.cachedFormData === formData
        ) {
            return this.cachedContextValue;
        }

        this.cachedSchema = schema;
        this.cachedFormData = formData;
        this.cachedContextValue = { arraySchema: schema, formData };

        return this.cachedContextValue;
    }
}
