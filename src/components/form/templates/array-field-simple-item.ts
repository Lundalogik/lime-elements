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

    private removeHandler: (event: any) => void;
    private moveUpHandler: (event: any) => void;
    private moveDownHandler: (event: any) => void;

    public componentDidMount() {
        const { item, index } = this.props;
        const removeButton = this.removeButton;
        this.removeHandler = item.onDropIndexClick(index);
        removeButton.addEventListener('click', this.removeHandler);

        const upButton = this.moveUpButton;
        this.moveUpHandler = item.onReorderClick(index, index - 1);
        upButton.addEventListener('click', this.moveUpHandler);

        const downButton = this.moveDownButton;
        this.moveDownHandler = item.onReorderClick(index, index + 1);
        downButton.addEventListener('click', this.moveDownHandler);
    }

    public componentWillUnmount() {
        this.removeButton.removeEventListener('click', this.removeHandler);

        this.moveUpButton.removeEventListener('click', this.moveUpHandler);

        this.moveDownButton.removeEventListener('click', this.moveDownHandler);
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
            ref: (button: HTMLLimelButtonElement) => {
                this.removeButton = button;
            },
        };
        if (!item.hasRemove) {
            props.disabled = true;
        }

        return React.createElement(LIMEL_ICON_BUTTON, props);
    }

    private renderMoveUpButton(item: ArrayFieldItem) {
        const props: any = {
            icon: 'up_arrow',
            ref: (button: HTMLLimelButtonElement) => {
                this.moveUpButton = button;
            },
        };
        if (!item.hasMoveUp) {
            props.disabled = true;
        }

        return React.createElement(LIMEL_ICON_BUTTON, props);
    }

    private renderMoveDownButton(item: ArrayFieldItem) {
        const props: any = {
            icon: 'down_arrow',
            ref: (button: HTMLLimelButtonElement) => {
                this.moveDownButton = button;
            },
        };
        if (!item.hasMoveDown) {
            props.disabled = true;
        }

        return React.createElement(LIMEL_ICON_BUTTON, props);
    }
}
