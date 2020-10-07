import { Component, h, State } from '@stencil/core';
import { schema } from './nested-schema';

/**
 * Nested data
 *
 * @link nested-schema.ts
 */
@Component({
    tag: 'limel-example-nested-form',
    shadow: true,
})
export class NestedFormExample {
    @State()
    private formData: object = {};

    constructor() {
        this.handleFormChange = this.handleFormChange.bind(this);
    }

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

    private handleFormChange(event) {
        this.formData = event.detail;
    }
}
