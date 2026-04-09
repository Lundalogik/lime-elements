import React, { PropsWithChildren } from 'react';
import { ArrayFieldItemButtonsTemplateProps } from '@rjsf/utils';

export interface SimpleItemProps {
    buttonsProps: ArrayFieldItemButtonsTemplateProps;
    index: number;
    allowItemRemoval: boolean;
    allowItemReorder: boolean;
}

const LIMEL_ICON_BUTTON = 'limel-icon-button';

export class SimpleItemTemplate extends React.Component<
    PropsWithChildren<SimpleItemProps>
> {
    constructor(public props: PropsWithChildren<SimpleItemProps>) {
        super(props);
    }

    private removeButton?: HTMLLimelIconButtonElement;

    public componentWillUnmount() {
        this.setRemoveButton(undefined);
    }

    public render() {
        const { allowItemReorder } = this.props;

        return React.createElement(
            'div',
            {
                className: 'array-item limel-form-array-item--simple',
                'data-reorder-id': String(this.props.index),
                'data-reorderable': allowItemReorder ? 'true' : 'false',
            },
            this.props.children,
            this.renderRemoveButton(),
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

    private renderRemoveButton() {
        if (!this.props.allowItemRemoval) {
            return;
        }

        const props: any = {
            icon: 'trash',
            disabled: !this.props.buttonsProps.hasRemove,
            ref: this.setRemoveButton,
        };

        return React.createElement(LIMEL_ICON_BUTTON, props);
    }

    private handleRemove = (event: PointerEvent): void => {
        this.props.buttonsProps.onRemoveItem(event);
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
