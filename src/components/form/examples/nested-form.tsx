import { Component, h, State } from '@stencil/core';
import { NestedFormData, schema } from './nested-schema';

/**
 * Nested data
 *
 * @sourceFile nested-schema.ts
 */
@Component({
    tag: 'limel-example-nested-form',
    shadow: true,
})
export class NestedFormExample {
    @State()
    private formData: NestedFormData = {};

    public render() {
        return [
            <limel-form
                onChange={this.handleFormChange}
                value={this.formData}
                schema={schema}
            />,
            <limel-example-value value={this.formData} />,
        ];
    }

    private handleFormChange = (event) => {
        this.formData = event.detail;
    };
}
