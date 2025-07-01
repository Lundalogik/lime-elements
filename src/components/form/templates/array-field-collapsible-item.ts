import { Action } from '../../collapsible-section/action';
import React from 'react';
import { findTitle } from './common';
import { ArrayFieldItem, Runnable } from './types';
import { isEmpty } from 'lodash-es';
import { JSONSchema7 } from 'json-schema';

interface CollapsibleItemProps {
    /**
     * Data from reach-jsonschema-form
     */
    item: ArrayFieldItem;

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
}

export class CollapsibleItemTemplate extends React.Component {
    state = {
        isOpen: false,
    };

    constructor(public props: CollapsibleItemProps) {
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
        let children: any;
        if (this.state.isOpen) {
            children = this.props.item.children;
        }

        return React.createElement(
            'limel-collapsible-section',
            {
                header: findTitle(data, schema, formSchema) || 'New item',
                class: 'limel-form-array-item--object',
                ref: (section: HTMLLimelCollapsibleSectionElement) => {
                    this.section = section;
                },
                'is-open': this.state.isOpen,
            },
            children
        );
    }

    private setActions(element: HTMLLimelCollapsibleSectionElement) {
        const { item, index } = this.props;
        const actions: Array<Action & Runnable> = [
            {
                id: 'down',
                icon: 'down_arrow',
                disabled: !item.hasMoveDown,
                run: item.onReorderClick(index, index + 1),
            },
            {
                id: 'up',
                icon: 'up_arrow',
                disabled: !item.hasMoveUp,
                run: item.onReorderClick(index, index - 1),
            },
            {
                id: 'remove',
                icon: 'trash',
                disabled: !item.hasRemove,
                run: item.onDropIndexClick(index),
            },
        ];

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
