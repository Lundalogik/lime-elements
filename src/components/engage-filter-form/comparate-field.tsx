import { Component, Prop, h } from '@stencil/core';
import { FieldProps } from '../form/fields/types';
import React from 'react';
import JSONSchemaField from 'react-jsonschema-form/lib/components/fields/SchemaField';

@Component({
    tag: 'limel-comparate-field',
    shadow: true,
    styleUrl: 'engage-filter-form.scss',
})
export class LimelComparateField {
    @Prop()
    public fieldProps: FieldProps;

    constructor() {
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return (
            <react-render
                content={React.createElement(JSONSchemaField, {
                    ...this.fieldProps,
                    onChange: this.handleChange,
                })}
            />
        );
    }

    private handleChange(data) {
        // Reset value when changing type
        if (data.type !== this.fieldProps.formData.type) {
            data = { ...data, value: null };
        }

        this.fieldProps.onChange(data);
    }
}
