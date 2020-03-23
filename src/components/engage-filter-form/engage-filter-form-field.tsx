import { Component, Prop, h } from '@stencil/core';
import { FieldProps } from '../form/fields/types';
import React from 'react';
import JSONSchemaField from 'react-jsonschema-form/lib/components/fields/SchemaField';

@Component({
    tag: 'engage-filter-form-field',
    shadow: true,
    styleUrl: 'engage-filter-form.scss',
})
export class EngageFilterFormField {
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
        // Reset expression when changing expression type
        if (data.expression_type !== this.fieldProps.formData.expression_type) {
            data = { ...data, expression: { left: {}, right: {} } };
        }

        this.fieldProps.onChange(data);
    }
}
