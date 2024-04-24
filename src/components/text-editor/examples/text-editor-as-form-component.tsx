import { Component, h, State } from '@stencil/core';
import { FormComponentFormData, schema } from './text-editor-form-data';
/**
 * Using the text editor as a form component
 *
 * Here we have a simple form that uses the `limel-text-editor` component,
 * instead of a regular text input field.
 *
 * :::note
 * This allows the user to write rich text, with markdown support, in the form.
 * But keep in mind that the value will be saved as a markdown string,
 * and can also contain HTML tags, depending on what the users input
 * in the filed.
 * :::
 * @sourceFile text-editor-form-data.ts
 */
@Component({
    tag: 'limel-example-text-editor-as-form-component',
    shadow: true,
})
export class TextEditorAsFormComponentExample {
    @State()
    private formData: FormComponentFormData = {
        name: 'Muhammad Ali',
        value: '<p>I am the <b>greatest</b>.</p>',
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
