import { Component, h, State } from '@stencil/core';
import { RowLayoutFormData, schema } from './row-layout-schema';

/**
 * Row layout
 *
 * @sourceFile row-layout-schema.ts
 */
@Component({
    tag: 'limel-example-form-row-layout',
    shadow: true,
})
export class FormRowLayoutExample {
    @State()
    private formData: RowLayoutFormData = {};

    public render() {
        return [
            <limel-form
                onChange={this.handleFormChange}
                value={this.formData}
                schema={schema}
            />,
        ];
    }

    private handleFormChange = (event) => {
        this.formData = event.detail;
    };
}
