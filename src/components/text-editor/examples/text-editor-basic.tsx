import { Component, h, State } from '@stencil/core';
import { FormComponentFormData, schema } from './text-editor-form-data';
/**
 * Basic example
 *
 * Here we have a simple form that uses the `limel-text-editor` component
 * @sourceFile text-editor-form-data.ts
 */
@Component({
    tag: 'limel-example-text-editor-basic',
    shadow: true,
})
export class TextEditorBasicExample {
    @State()
    private formData: FormComponentFormData = {
        name: 'Ali',
        value: '<p>I am the greatest</p>',
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
