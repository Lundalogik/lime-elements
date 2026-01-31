import { ValidationStatus } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';
import {
    schema,
    BuiltinFieldTypesFormData,
} from './builtin-field-types-schema';

/**
 * All built-in field types
 *
 * This example demonstrates all the field types that are available
 * out of the box in the form component, without requiring custom components.
 *
 * The available types are:
 *
 * - **Text**: `type: 'string'`
 * - **Email**: `type: 'string', format: 'email'`
 * - **Readonly**: `type: 'string', readOnly: true`
 * - **Date**: `type: 'string', format: 'date'`
 * - **Date-Time**: `type: 'string', format: 'date-time'`
 * - **Time**: `type: 'string', format: 'time'`
 * - **Number**: `type: 'number'`
 * - **Integer**: `type: 'integer'`
 * - **Slider**: `type: 'number'` with `minimum`, `maximum`, and `multipleOf`
 * - **Percentage**: `type: 'number'` with `minimum: 0`, `maximum: 1`, `multipleOf < 1`
 * - **Checkbox**: `type: 'boolean'`
 * - **Select**: `type: 'string'` with `oneOf` containing options
 * - **Multi-select**: `type: 'array'` with `uniqueItems` and `anyOf` items
 * - **String Array**: `type: 'array'` with `items: { type: 'string' }`
 * - **Nested Object**: `type: 'object'` with `properties`
 * - **JSON Editor**: `type: 'object'` with `additionalProperties: true`
 *
 * @sourceFile builtin-field-types-schema.ts
 */
@Component({
    tag: 'limel-example-builtin-field-types-form',
    shadow: true,
})
export class BuiltinFieldTypesFormExample {
    @State()
    private formData: BuiltinFieldTypesFormData = {
        textField: 'Hello World',
        dateField: '2024-01-15',
        sliderField: 50,
        percentField: 0.75,
        multiSelectField: ['work', 'urgent'],
        stringArrayField: ['First item', 'Second item'],
        nestedObject: {
            city: 'Stockholm',
            country: 'Sweden',
        },
        jsonField: {
            key: 'value',
            nested: { data: true },
        },
    };

    @State()
    private valid = true;

    public render() {
        return (
            <Host>
                <limel-form
                    onChange={this.handleFormChange}
                    onValidate={this.handleFormValidate}
                    value={this.formData}
                    schema={schema}
                />
                <br />
                <limel-button
                    label="Submit"
                    primary={true}
                    disabled={!this.valid}
                    onClick={this.handleSubmit}
                />
                <limel-example-value value={this.formData} />
            </Host>
        );
    }

    private handleFormChange = (
        event: CustomEvent<BuiltinFieldTypesFormData>
    ) => {
        this.formData = event.detail;
    };

    private handleFormValidate = (event: CustomEvent<ValidationStatus>) => {
        this.valid = event.detail.valid;
    };

    private handleSubmit = () => {
        const json = JSON.stringify(this.formData, null, '    ');
        alert(`Form data:\n\n${json}`);
    };
}
