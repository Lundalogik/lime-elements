import { Component, h, State } from '@stencil/core';
import { schema } from './custom-component-schema';

/**
 * Custom form component
 *
 * @link custom-component-schema.ts
 * @link custom-component-picker.tsx
 */
@Component({
    tag: 'limel-example-custom-component-form',
    shadow: true,
})
export class CustomComponentFormExample {
    @State()
    private formData: object = {
        name: 'My superhero deal',
        value: 1000000,
        hero: 1001,
    };

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
