import React from 'react';
import { renderDescription, renderTitle } from './common';
import { toSchemaPath } from './object-field';
import { ArrayFieldTemplateProps } from './types';
import { FormSchema } from '../form.types';
import { getHelpComponent } from '../help';
import { DragToReorder, ReorderEvent } from '../../../util/drag-to-reorder';
import { ArrayFieldContext, ArrayFieldOptions } from './array-context';

export const ARRAY_REORDER_EVENT = 'arrayReorder';

interface ArrayFieldTemplateState {
    order: number[];
}

const DRAGGABLE_ITEM_SELECTOR = '.array-item[data-reorderable="true"]';

export class ArrayFieldTemplate extends React.Component<
    ArrayFieldTemplateProps,
    ArrayFieldTemplateState
> {
    private container?: HTMLDivElement;
    private readonly dragToReorder: DragToReorder;
    private cachedContextValue: ArrayFieldOptions | null = null;
    private cachedSchema?: FormSchema;
    private cachedFormData?: any[];
    private cachedPath?: string;

    public constructor(props: ArrayFieldTemplateProps) {
        super(props);

        this.state = {
            order: this.extractIndices(props.items),
        };
        this.dragToReorder = new DragToReorder({
            draggable: DRAGGABLE_ITEM_SELECTOR,
            onReorder: this.handleReorder,
        });
    }

    public componentWillUnmount() {
        this.dragToReorder.teardown();
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
                getHelpComponent(this.props.schema as FormSchema),
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

        this.dragToReorder.teardown();
        this.container = element ?? undefined;
        this.setupDragController();
    };

    private getOrderedItems(): React.ReactElement[] {
        const items = this.props.items ?? [];
        if (items.length === 0) {
            return [];
        }

        const byKey = new Map<number, React.ReactElement>(items.entries());

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

        for (const [index, entry] of byKey) {
            if (!used.has(index)) {
                ordered.push(entry);
            }
        }

        return ordered;
    }

    private readonly handleReorder = ({
        order,
        fromIndex,
        toIndex,
    }: ReorderEvent) => {
        this.setState({ order: order.map(Number) });
        this.container?.dispatchEvent(
            new CustomEvent(ARRAY_REORDER_EVENT, {
                bubbles: true,
                detail: { fromIndex, toIndex },
            })
        );
    };

    private setupDragController() {
        if (!this.container || !this.canReorderItems()) {
            this.dragToReorder.teardown();
            return;
        }

        this.dragToReorder.setup(this.container);
    }

    private canReorderItems(): boolean {
        if (this.props.disabled || this.props.readonly) {
            return false;
        }

        const schema = this.props.schema as FormSchema;
        const limeOptions = schema?.lime || {};

        return limeOptions.allowItemReorder !== false;
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
        const schemaPath = (this.props.fieldPathId?.path ?? []).map(String);
        const path = toSchemaPath(schemaPath);

        if (
            this.cachedContextValue &&
            this.cachedSchema === schema &&
            this.cachedFormData === formData &&
            this.cachedPath === path
        ) {
            return this.cachedContextValue;
        }

        this.cachedSchema = schema;
        this.cachedFormData = formData;
        this.cachedPath = path;
        this.cachedContextValue = { arraySchema: schema, formData, schemaPath };

        return this.cachedContextValue;
    }
}
