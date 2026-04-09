import { Action } from '../../collapsible-section/action';
import React, { PropsWithChildren, ReactNode } from 'react';
import { findTitle } from './common';
import { ArrayFieldItemButtonsTemplateProps } from '@rjsf/utils';
import { Runnable } from './types';
import { isEmpty } from 'lodash-es';
import { JSONSchema7 } from 'json-schema';

export interface CollapsibleItemProps {
    buttonsProps: ArrayFieldItemButtonsTemplateProps;

    /**
     * The index of the field in the array
     */
    index: number;

    /**
     * The value of the field
     */
    data: any;

    /**
     * Schema for the field
     */
    schema: JSONSchema7;

    /**
     * Schema for the entire form
     */
    formSchema: JSONSchema7;

    /**
     * Control whether items can be removed.
     */
    allowItemRemoval: boolean;

    /**
     * Whether this particular item can be reordered.
     */
    allowItemReorder: boolean;
}

export class CollapsibleItemTemplate extends React.Component<
    PropsWithChildren<CollapsibleItemProps>
> {
    state = {
        isOpen: false,
    };

    constructor(public props: PropsWithChildren<CollapsibleItemProps>) {
        super(props);
        this.handleAction = this.handleAction.bind(this);
        this.isDeepEmpty = this.isDeepEmpty.bind(this);

        this.state = {
            isOpen: this.isDeepEmpty(props.data),
        };
    }

    private section: HTMLLimelCollapsibleSectionElement;

    public componentDidMount() {
        const section = this.section;
        section.addEventListener('action', this.handleAction);
        section.addEventListener('open', this.handleOpen);

        this.setActions(section);
    }

    public componentDidUpdate() {
        this.setActions(this.section);
    }

    public componentWillUnmount() {
        const section = this.section;
        section.removeEventListener('action', this.handleAction);
        section.removeEventListener('open', this.handleOpen);
    }

    public render() {
        const { data, schema, formSchema } = this.props;
        let children: ReactNode;
        if (this.state.isOpen) {
            children = this.props.children;
        }

        const dragHandle = this.props.allowItemReorder
            ? React.createElement('limel-drag-handle', {
                  slot: 'header',
                  class: 'drag-handle',
              })
            : null;

        return React.createElement(
            'limel-collapsible-section',
            {
                header: findTitle(data, schema, formSchema) || 'New item',
                class: 'array-item limel-form-array-item--object',
                ref: (section: HTMLLimelCollapsibleSectionElement) => {
                    this.section = section;
                },
                'is-open': this.state.isOpen,
                'data-reorder-id': String(this.props.index),
                'data-reorderable': this.props.allowItemReorder
                    ? 'true'
                    : 'false',
            },
            dragHandle,
            children
        );
    }

    private setActions(element: HTMLLimelCollapsibleSectionElement) {
        const { buttonsProps, allowItemRemoval } = this.props;
        const actions: Array<Action & Runnable> = [];

        if (allowItemRemoval) {
            actions.push({
                id: 'remove',
                icon: 'trash',
                disabled: !buttonsProps.hasRemove,
                run: buttonsProps.onRemoveItem,
            });
        }

        element.actions = actions;
    }

    private handleAction(event: CustomEvent<Action & Runnable>) {
        event.stopPropagation();
        event.detail.run(event);
    }

    private handleOpen = () => {
        this.setState({
            isOpen: true,
        });
    };

    private isDeepEmpty(data) {
        if (typeof data !== 'object') {
            return false;
        }

        if (isEmpty(data)) {
            return true;
        }

        return Object.values(data).every(this.isDeepEmpty);
    }
}
