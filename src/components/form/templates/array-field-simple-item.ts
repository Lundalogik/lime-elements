import React from 'react';
import { ArrayFieldItem } from './types';

interface SimpleItemProps {
    item: ArrayFieldItem;
    index: number;
}

const LIMEL_ICON_BUTTON = 'limel-icon-button';

export class SimpleItemTemplate extends React.Component {
    public refs: { removeButton: any; moveUpButton: any; moveDownButton: any };

    constructor(public props: SimpleItemProps) {
        super(props);
    }

    private removeHandler: (event: any) => void;
    private moveUpHandler: (event: any) => void;
    private moveDownHandler: (event: any) => void;

    public componentDidMount() {
        const { item, index } = this.props;
        const removeButton: HTMLLimelButtonElement = this.refs.removeButton;
        this.removeHandler = item.onDropIndexClick(index);
        removeButton.addEventListener('click', this.removeHandler);

        const upButton: HTMLLimelButtonElement = this.refs.moveUpButton;
        this.moveUpHandler = item.onReorderClick(index, index - 1);
        upButton.addEventListener('click', this.moveUpHandler);

        const downButton: HTMLLimelButtonElement = this.refs.moveDownButton;
        this.moveDownHandler = item.onReorderClick(index, index + 1);
        downButton.addEventListener('click', this.moveDownHandler);
    }

    public componentWillUnmount() {
        const removeButton: HTMLLimelButtonElement = this.refs.removeButton;
        removeButton.removeEventListener('click', this.removeHandler);

        const upButton: HTMLLimelButtonElement = this.refs.moveUpButton;
        upButton.removeEventListener('click', this.moveUpHandler);

        const downButton: HTMLLimelButtonElement = this.refs.moveDownButton;
        downButton.removeEventListener('click', this.moveDownHandler);
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
            ref: 'removeButton',
        };
        if (!item.hasRemove) {
            props.disabled = true;
        }

        return React.createElement(LIMEL_ICON_BUTTON, props);
    }

    private renderMoveUpButton(item: ArrayFieldItem) {
        const props: any = {
            icon: 'up_arrow',
            ref: 'moveUpButton',
        };
        if (!item.hasMoveUp) {
            props.disabled = true;
        }

        return React.createElement(LIMEL_ICON_BUTTON, props);
    }

    private renderMoveDownButton(item: ArrayFieldItem) {
        const props: any = {
            icon: 'down_arrow',
            ref: 'moveDownButton',
        };
        if (!item.hasMoveDown) {
            props.disabled = true;
        }

        return React.createElement(LIMEL_ICON_BUTTON, props);
    }
}
