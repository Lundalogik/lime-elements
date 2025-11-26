import React from 'react';
import { isObjectType } from '../schema';
import { CollapsibleItemTemplate } from './array-field-collapsible-item';
import { SimpleItemTemplate } from './array-field-simple-item';
import { renderDescription, renderTitle } from './common';
import { ArrayFieldItem, ArrayFieldTemplateProps } from './types';
import { FormSchema } from '../form.types';
import {
    dragToReorder,
    DragToReorderController,
    DragToReorderFinalizeDetail,
    DragToReorderPreviewDetail,
} from '../../../util/drag-to-reorder';

interface ArrayItemControls {
    allowItemRemoval: boolean;
}

interface ArrayFieldTemplateState {
    order: number[];
}

export class ArrayFieldTemplate extends React.Component<
    ArrayFieldTemplateProps,
    ArrayFieldTemplateState
> {
    private container?: HTMLDivElement;
    private dragController?: DragToReorderController;
    private dragSnapshot?: number[];
    private dragReorderableSnapshot?: number[];
    private itemByIndex: Map<number, ArrayFieldItem> = new Map();

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
        const controls = this.getItemControls();
        const { ordered: orderedItems, byIndex } = this.getOrderedItems();
        this.itemByIndex = byIndex;

        return React.createElement(
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
                orderedItems.map((item, index) =>
                    this.renderItem(item, index, controls)
                )
            ),
            this.renderAddButton()
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

    private getItemControls(): ArrayItemControls {
        return {
            allowItemRemoval: this.canRemoveItems(),
        };
    }

    private handleAddClick = (event: MouseEvent) => {
        event.stopPropagation();
        this.props.onAddClick(event);
    };

    private renderItem(
        item: ArrayFieldItem,
        index: number,
        controls: ArrayItemControls
    ) {
        const { schema, formData, formContext } = this.props;
        const itemIndex = item.index ?? index;
        const allowItemReorder = this.isItemReorderable(item);

        if (isObjectType(schema.items as FormSchema)) {
            return React.createElement(CollapsibleItemTemplate, {
                key: item.key,
                item: item,
                data: Array.isArray(formData) ? formData[itemIndex] : undefined,
                schema: schema,
                formSchema: formContext.schema,
                index: itemIndex,
                allowItemRemoval: controls.allowItemRemoval,
                allowItemReorder: allowItemReorder,
            });
        }

        return React.createElement(SimpleItemTemplate, {
            key: item.key,
            item: item,
            index: itemIndex,
            dataIndex: itemIndex,
            allowItemRemoval: controls.allowItemRemoval,
            allowItemReorder: allowItemReorder,
        });
    }

    private setContainer = (element: HTMLDivElement | null) => {
        if (this.container === element) {
            return;
        }

        this.teardownDragController();
        this.container = element ?? undefined;
        this.setupDragController();
    };

    private getOrderedItems(): {
        ordered: ArrayFieldItem[];
        byIndex: Map<number, ArrayFieldItem>;
    } {
        const items = this.props.items ?? [];
        const byIndex = new Map<number, ArrayFieldItem>();

        let entryIndex = 0;
        for (const entry of items) {
            byIndex.set(entry.index ?? entryIndex, entry);
            entryIndex += 1;
        }

        const ordered: ArrayFieldItem[] = [];
        const used = new Set<number>();

        for (const index of this.state.order) {
            const entry = byIndex.get(index);
            if (!entry) {
                continue;
            }

            ordered.push(entry);
            used.add(index);
        }

        for (const [index, entry] of byIndex.entries()) {
            if (!used.has(index)) {
                ordered.push(entry);
            }
        }

        return {
            ordered,
            byIndex,
        };
    }

    private handleDragStart = () => {
        if (!this.canReorderItems()) {
            return;
        }

        this.dragSnapshot = [...this.state.order];
        this.dragReorderableSnapshot = this.getReorderableOrder(
            this.dragSnapshot
        );
    };

    private handleDragPreview = ({
        fromIndex,
        toIndex,
    }: DragToReorderPreviewDetail) => {
        if (!this.canReorderItems() || fromIndex === toIndex) {
            return;
        }

        this.setState((previous) => {
            const reorderableOrder = this.getReorderableOrder(previous.order);
            const length = reorderableOrder.length;

            if (length < 2) {
                return null;
            }

            if (
                fromIndex < 0 ||
                fromIndex >= length ||
                toIndex < 0 ||
                toIndex >= length
            ) {
                return null;
            }

            const updatedReorderable = this.moveEntries(
                reorderableOrder,
                fromIndex,
                toIndex
            );

            if (this.arraysEqual(updatedReorderable, reorderableOrder)) {
                return null;
            }

            const merged = this.mergeReorderableOrder(
                previous.order,
                updatedReorderable
            );

            if (this.arraysEqual(merged, previous.order)) {
                return null;
            }

            return {
                order: merged,
            };
        });
    };

    private handleDragFinalize = ({
        fromIndex,
        toIndex,
        cancelled,
    }: DragToReorderFinalizeDetail) => {
        const snapshot = this.dragSnapshot;
        const reorderableSnapshot = this.dragReorderableSnapshot;
        this.dragSnapshot = undefined;
        this.dragReorderableSnapshot = undefined;

        if (!this.canReorderItems() || !snapshot || !reorderableSnapshot) {
            return;
        }

        if (cancelled) {
            if (!this.arraysEqual(this.state.order, snapshot)) {
                this.setState({ order: snapshot });
            }
            return;
        }

        if (fromIndex === toIndex) {
            return;
        }

        const length = reorderableSnapshot.length;
        if (
            fromIndex < 0 ||
            fromIndex >= length ||
            toIndex < 0 ||
            toIndex >= length
        ) {
            if (!this.arraysEqual(this.state.order, snapshot)) {
                this.setState({ order: snapshot });
            }
            return;
        }

        if (length < 2) {
            return;
        }

        const finalReorderable = this.moveEntries(
            reorderableSnapshot,
            fromIndex,
            toIndex
        );
        const finalOrder = this.mergeReorderableOrder(
            snapshot,
            finalReorderable
        );

        if (!this.arraysEqual(this.state.order, finalOrder)) {
            this.setState({ order: finalOrder });
        }

        const fromActualIndex = reorderableSnapshot[fromIndex];
        if (fromActualIndex === undefined) {
            return;
        }

        const toActualIndex = finalOrder.indexOf(fromActualIndex);

        if (toActualIndex === -1 || fromActualIndex === toActualIndex) {
            return;
        }

        const targetItem = (this.props.items ?? []).find((entry) => {
            return (entry.index ?? -1) === fromActualIndex;
        });

        if (!targetItem) {
            return;
        }

        requestAnimationFrame(() => {
            const reorder = targetItem.onReorderClick(
                fromActualIndex,
                toActualIndex
            );

            if (typeof reorder === 'function') {
                reorder({
                    preventDefault() {},
                    stopPropagation() {},
                } as any);
            }
        });
    };

    private setupDragController() {
        if (!this.container || !this.canReorderItems()) {
            this.teardownDragController();
            return;
        }

        const reorderableCount = this.getReorderableOrder().length;
        if (reorderableCount < 2) {
            this.teardownDragController();
            return;
        }

        if (this.dragController) {
            return;
        }

        this.dragController = dragToReorder({
            container: this.container,
            itemSelector: '.array-item[data-reorderable="true"]',
            dragHandleSelector: '[data-drag-handle]',
            onStart: this.handleDragStart,
            onPreview: this.handleDragPreview,
            onFinalize: this.handleDragFinalize,
        });
    }

    private teardownDragController() {
        if (this.dragController) {
            this.dragController.destroy();
            this.dragController = undefined;
        }

        this.dragSnapshot = undefined;
        this.dragReorderableSnapshot = undefined;
    }

    private canReorderItems(): boolean {
        if (this.props.disabled || this.props.readonly) {
            return false;
        }

        const schema = this.props.schema as FormSchema;
        const limeOptions = schema?.lime || {};

        return limeOptions.allowItemReorder !== false;
    }

    private canRemoveItems(): boolean {
        const schema = this.props.schema as FormSchema;
        const limeOptions = schema?.lime || {};

        return limeOptions.allowItemRemoval !== false;
    }

    private isItemReorderable(item: ArrayFieldItem): boolean {
        return (
            this.canReorderItems() &&
            Boolean(item?.hasMoveDown || item?.hasMoveUp)
        );
    }

    private isIndexReorderable(index: number): boolean {
        const item = this.itemByIndex.get(index);

        if (!item) {
            return false;
        }

        return this.isItemReorderable(item);
    }

    private getReorderableOrder(order: number[] = this.state.order): number[] {
        const result: number[] = [];

        for (const index of order) {
            if (this.isIndexReorderable(index)) {
                result.push(index);
            }
        }

        return result;
    }

    private mergeReorderableOrder(
        order: number[],
        reorderable: number[]
    ): number[] {
        const result: number[] = [];
        let pointer = 0;

        for (const index of order) {
            if (this.isIndexReorderable(index)) {
                const replacement = reorderable[pointer];

                if (replacement === undefined) {
                    return [...order];
                }

                result.push(replacement);
                pointer += 1;
            } else {
                result.push(index);
            }
        }

        if (pointer !== reorderable.length) {
            return [...order];
        }

        return result;
    }

    private moveEntries<T>(order: T[], from: number, to: number): T[] {
        if (from === to) {
            return [...order];
        }

        if (from < 0 || from >= order.length || to < 0 || to >= order.length) {
            return [...order];
        }

        const updated = [...order];
        const [moved] = updated.splice(from, 1);

        if (moved === undefined) {
            return [...order];
        }

        updated.splice(to, 0, moved);

        return updated;
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

    private extractIndices(items: ArrayFieldItem[] = []): number[] {
        return (items ?? []).map((item, index) => item.index ?? index);
    }
}
