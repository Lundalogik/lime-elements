import React from 'react';
import { isObjectType } from '../schema';
import { CollapsibleItemTemplate } from './array-field-collapsible-item';
import { SimpleItemTemplate } from './array-field-simple-item';
import {
    renderDescription,
    renderTitle,
    renderCustomTemplateAdapter,
    hasOverridenTemplate,
} from './common';
import { ArrayFieldItem, ArrayFieldTemplateProps } from './types';

export class ArrayFieldTemplate extends React.Component {
    constructor(public props: ArrayFieldTemplateProps) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
        this.handleAddClick = this.handleAddClick.bind(this);
    }

    public render() {
        if (hasOverridenTemplate(this.props.schema)) {
            return renderCustomTemplateAdapter(this.props);
        }

        return React.createElement(
            'div',
            {},
            renderTitle(this.props.title),
            renderDescription(this.props.schema.description),
            this.props.items.map(this.renderItem),
            this.renderAddButton()
        );
    }

    private renderAddButton() {
        if (!this.props.canAdd) {
            return;
        }

        return React.createElement('limel-button', {
            outlined: true,
            label: 'Add',
            onClick: this.handleAddClick,
            icon: 'add',
        });
    }

    private renderItem(item: ArrayFieldItem, index: number) {
        const key = `id_${index}`;
        const { schema, formData, formContext } = this.props;

        if (isObjectType(schema.items)) {
            return React.createElement(CollapsibleItemTemplate, {
                key: key,
                item: item,
                data: formData[index],
                schema: schema,
                formSchema: formContext.schema,
                index: index,
            });
        }

        return React.createElement(SimpleItemTemplate, {
            key: key,
            item: item,
            index: index,
        });
    }

    private handleAddClick(event: MouseEvent) {
        event.stopPropagation();
        this.props.onAddClick(event);
    }
}
