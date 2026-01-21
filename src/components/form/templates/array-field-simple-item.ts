import React from 'react';
import { ArrayFieldItem } from './types';

interface SimpleItemProps {
    item: ArrayFieldItem;
    index: number;
    allowItemRemoval: boolean;
    allowItemReorder: boolean;
    dataIndex: number;
}

const LIMEL_ICON_BUTTON = 'limel-icon-button';

export class SimpleItemTemplate extends React.Component<SimpleItemProps> {
    constructor(public props: SimpleItemProps) {
        super(props);
    }

    private removeButton?: HTMLLimelIconButtonElement;

    public componentWillUnmount() {
        this.setRemoveButton(undefined);
    }

    public render() {
        const { item, allowItemReorder } = this.props;

        return React.createElement(
            'div',
            {
                className: 'array-item limel-form-array-item--simple',
                'data-reorder-id': String(this.props.dataIndex),
                'data-reorderable': allowItemReorder ? 'true' : 'false',
            },
            this.props.item.children,
            this.renderRemoveButton(item),
            this.renderDragHandle()
        );
    }

    private renderDragHandle() {
        if (!this.props.allowItemReorder) {
            return;
        }

        return React.createElement('limel-drag-handle', {
            class: 'drag-handle',
        });
    }

    private renderRemoveButton(item: ArrayFieldItem) {
        if (!this.props.allowItemRemoval) {
            return;
        }

        const props: any = {
            icon: 'trash',
            disabled: !item.hasRemove,
            ref: this.setRemoveButton,
        };

        return React.createElement(LIMEL_ICON_BUTTON, props);
    }

    private handleRemove = (event: PointerEvent): void => {
        const { item, index } = this.props;
        item.onDropIndexClick(index)(event);
    };

    private readonly setRemoveButton = (
        button?: HTMLLimelIconButtonElement | null
    ) => {
        if (this.removeButton) {
            this.removeButton.removeEventListener('click', this.handleRemove);
        }

        this.removeButton = button || undefined;

        if (this.removeButton) {
            this.removeButton.addEventListener('click', this.handleRemove);
        }
    };
}
