import React from 'react';
import { ArrayFieldItem } from './types';

export class SimpleItemTemplate extends React.Component {
    private props: { item: ArrayFieldItem; index: number };
    private refs: { removeButton: any; moveUpButton: any; moveDownButton: any };

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
        // tslint:disable-next-line:no-duplicate-string
        return React.createElement('limel-icon-button', {
            icon: 'trash',
            disabled: !item.hasRemove,
            ref: 'removeButton',
        });
    }

    private renderMoveUpButton(item: ArrayFieldItem) {
        // tslint:disable-next-line:no-duplicate-string
        return React.createElement('limel-icon-button', {
            icon: 'up_arrow',
            disabled: !item.hasMoveUp,
            ref: 'moveUpButton',
        });
    }

    private renderMoveDownButton(item: ArrayFieldItem) {
        // tslint:disable-next-line:no-duplicate-string
        return React.createElement('limel-icon-button', {
            icon: 'down_arrow',
            disabled: !item.hasMoveDown,
            ref: 'moveDownButton',
        });
    }
}
