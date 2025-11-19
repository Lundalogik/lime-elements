import React from 'react';
import { ArrayFieldItem } from './types';

interface SimpleItemProps {
    item: ArrayFieldItem;
    index: number;
    allowItemRemoval: boolean;
    allowItemReorder: boolean;
}

const LIMEL_ICON_BUTTON = 'limel-icon-button';

export class SimpleItemTemplate extends React.Component<SimpleItemProps> {
    constructor(public props: SimpleItemProps) {
        super(props);
    }

    private removeButton?: HTMLLimelButtonElement;
    private moveUpButton?: HTMLLimelButtonElement;
    private moveDownButton?: HTMLLimelButtonElement;

    public componentWillUnmount() {
        this.setRemoveButton(undefined);
        this.setMoveUpButton(undefined);
        this.setMoveDownButton(undefined);
    }

    public render() {
        const { item } = this.props;

        return React.createElement(
            'div',
            {
                className: 'limel-form-array-item--simple',
            },
            this.props.item.children,
            this.props.allowItemRemoval ? this.renderRemoveButton(item) : null,
            this.props.allowItemReorder ? this.renderMoveUpButton(item) : null,
            this.props.allowItemReorder ? this.renderMoveDownButton(item) : null
        );
    }

    private renderRemoveButton(item: ArrayFieldItem) {
        const props: any = {
            icon: 'trash',
            disabled: !item.hasRemove,
            ref: this.setRemoveButton,
        };

        return React.createElement(LIMEL_ICON_BUTTON, props);
    }

    private renderMoveUpButton(item: ArrayFieldItem) {
        const props: any = {
            icon: 'up_arrow',
            disabled: !item.hasMoveUp,
            ref: this.setMoveUpButton,
        };

        return React.createElement(LIMEL_ICON_BUTTON, props);
    }

    private renderMoveDownButton(item: ArrayFieldItem) {
        const props: any = {
            icon: 'down_arrow',
            disabled: !item.hasMoveDown,
            ref: this.setMoveDownButton,
        };

        return React.createElement(LIMEL_ICON_BUTTON, props);
    }

    private handleRemove = (event: PointerEvent): void => {
        const { item, index } = this.props;
        item.onDropIndexClick(index)(event);
    };

    private handleMoveUp = (event: PointerEvent): void => {
        const { item, index } = this.props;
        item.onReorderClick(index, index - 1)(event);
    };

    private handleMoveDown = (event: PointerEvent): void => {
        const { item, index } = this.props;
        item.onReorderClick(index, index + 1)(event);
    };

    private setRemoveButton = (button?: HTMLLimelButtonElement | null) => {
        if (this.removeButton) {
            this.removeButton.removeEventListener('click', this.handleRemove);
        }

        this.removeButton = button || undefined;

        if (this.removeButton) {
            this.removeButton.addEventListener('click', this.handleRemove);
        }
    };

    private setMoveUpButton = (button?: HTMLLimelButtonElement | null) => {
        if (this.moveUpButton) {
            this.moveUpButton.removeEventListener('click', this.handleMoveUp);
        }

        this.moveUpButton = button || undefined;

        if (this.moveUpButton) {
            this.moveUpButton.addEventListener('click', this.handleMoveUp);
        }
    };

    private setMoveDownButton = (button?: HTMLLimelButtonElement | null) => {
        if (this.moveDownButton) {
            this.moveDownButton.removeEventListener(
                'click',
                this.handleMoveDown
            );
        }

        this.moveDownButton = button || undefined;

        if (this.moveDownButton) {
            this.moveDownButton.addEventListener('click', this.handleMoveDown);
        }
    };
}
