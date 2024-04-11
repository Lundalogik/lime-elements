import { Component, h, State } from '@stencil/core';
import { FormComponentFormData, schema } from './form-component-form-data';
/**
 * Basic example
 *
 * Here we have a simple form that uses the `limel-text-editor-form-component` component
 * @sourceFile form-component-form-data.ts
 */
@Component({
    tag: 'limel-example-text-editor-form-component-basic',
    shadow: true,
})
export class TextEditorFormComponentBasicExample {
    @State()
    private formData: FormComponentFormData = {
        name: 'Ali',
        value: {
            html: '<p>I am the greatest</p>',
        },
    };

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

    private handleFormChange = (event: CustomEvent<FormComponentFormData>) => {
        event.stopPropagation();
        this.formData = event.detail;
    };
}
