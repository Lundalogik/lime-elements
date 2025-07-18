import React from 'react';
import { ArrayFieldItem } from './types';

interface SimpleItemProps {
    item: ArrayFieldItem;
    index: number;
}

const LIMEL_ICON_BUTTON = 'limel-icon-button';

export class SimpleItemTemplate extends React.Component {
    constructor(public props: SimpleItemProps) {
        super(props);
    }

    private removeButton: HTMLLimelButtonElement;
    private moveUpButton: HTMLLimelButtonElement;
    private moveDownButton: HTMLLimelButtonElement;

    public componentDidMount() {
        this.removeButton.addEventListener('click', this.handleRemove);
        this.moveUpButton.addEventListener('click', this.handleMoveUp);
        this.moveDownButton.addEventListener('click', this.handleMoveDown);
    }

    public componentWillUnmount() {
        this.removeButton.removeEventListener('click', this.handleRemove);
        this.moveUpButton.removeEventListener('click', this.handleMoveUp);
        this.moveDownButton.removeEventListener('click', this.handleMoveDown);
    }

    public render() {
        const { item } = this.props;

        return React.createElement(
            'div',
            {
                className: 'limel-form-array-item--simple',
            },
            this.props.item.children,
            this.renderRemoveButton(item),
            this.renderMoveUpButton(item),
            this.renderMoveDownButton(item)
        );
    }

    private renderRemoveButton(item: ArrayFieldItem) {
        const props: any = {
            icon: 'trash',
            disabled: !item.hasRemove,
            ref: (button: HTMLLimelButtonElement) => {
                this.removeButton = button;
            },
        };

        return React.createElement(LIMEL_ICON_BUTTON, props);
    }

    private renderMoveUpButton(item: ArrayFieldItem) {
        const props: any = {
            icon: 'up_arrow',
            disabled: !item.hasMoveUp,
            ref: (button: HTMLLimelButtonElement) => {
                this.moveUpButton = button;
            },
        };

        return React.createElement(LIMEL_ICON_BUTTON, props);
    }

    private renderMoveDownButton(item: ArrayFieldItem) {
        const props: any = {
            icon: 'down_arrow',
            disabled: !item.hasMoveDown,
            ref: (button: HTMLLimelButtonElement) => {
                this.moveDownButton = button;
            },
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
}
