import { Component, h, State } from '@stencil/core';
import { FormComponentFormData, schema } from './text-editor-form-data';
import { cloneDeep } from 'lodash-es';

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
    styleUrl: 'text-editor-as-form-component.scss',
})
export class TextEditorAsFormComponentExample {
    @State()
    private formData: FormComponentFormData = {
        name: 'Muhammad Ali',
        value: '<p>I am the <b>greatest</b>.</p>',
    };

    @State()
    private formDirty = false;

    // We fake a bit of state handling here, to
    // be able to reset and "save" the form.
    // This is mainly to visualize when the form
    // is considered dirty.
    private savedFormData: FormComponentFormData;

    public componentWillLoad() {
        this.savedFormData = cloneDeep(this.formData);
    }

    public render() {
        return [
            <limel-form
                onChange={this.handleFormChange}
                value={this.formData}
                schema={schema}
            />,
            <div class="buttons">
                <limel-button
                    label="Save"
                    disabled={!this.formDirty}
                    onClick={this.handleSave}
                    primary={true}
                    class="has-reduced-presence"
                />
                <limel-button
                    label="Reset"
                    disabled={!this.formDirty}
                    onClick={this.handleReset}
                    class="has-reduced-presence"
                />
            </div>,
            <limel-example-value value={this.formData} />,
        ];
    }

    private handleFormChange = (event: CustomEvent<FormComponentFormData>) => {
        event.stopPropagation();
        this.formData = event.detail;
        this.formDirty = this.getFormDirtyState();
    };

    private handleSave = () => {
        this.savedFormData = cloneDeep(this.formData);
        this.formDirty = this.getFormDirtyState();
    };

    private handleReset = () => {
        this.formData = cloneDeep(this.savedFormData);
        this.formDirty = this.getFormDirtyState();
    };

    private getFormDirtyState = () => {
        return (
            JSON.stringify(this.formData) !== JSON.stringify(this.savedFormData)
        );
    };
}
