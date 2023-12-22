import { Action } from '../../collapsible-section/action';
import React from 'react';
import { findTitle } from './common';
import { ArrayFieldItem, Runnable } from './types';
import { isEmpty } from 'lodash-es';

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
    schema: any;

    /**
     * Schema for the entire form
     */
    formSchema: any;
}

export class CollapsibleItemTemplate extends React.Component {
    public refs: { section: any };
    private isOpen: boolean;

    constructor(public props: CollapsibleItemProps) {
        super(props);
        this.handleAction = this.handleAction.bind(this);
        this.isDeepEmpty = this.isDeepEmpty.bind(this);

        this.isOpen = this.isDeepEmpty(props.data);
    }

    public componentDidMount() {
        const section: HTMLLimelCollapsibleSectionElement = this.refs.section;
        section.addEventListener('action', this.handleAction);

        this.setActions(section);
    }

    public componentDidUpdate() {
        const section: HTMLLimelCollapsibleSectionElement = this.refs.section;
        this.setActions(section);
    }

    public componentWillUnmount() {
        const section: HTMLLimelCollapsibleSectionElement = this.refs.section;
        section.removeEventListener('action', this.handleAction);
    }

    public render() {
        const { data, schema, formSchema } = this.props;

        return React.createElement(
            'limel-collapsible-section',
            {
                header: findTitle(data, schema, formSchema) || 'New item',
                class: 'limel-form-array-item--object',
                ref: 'section',
                'is-open': this.isOpen,
            },
            this.props.item.children
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
