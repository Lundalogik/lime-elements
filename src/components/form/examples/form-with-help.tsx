import { Component, h, State } from '@stencil/core';
import { schema } from './help-form-schema';

/**
 * Form fields with help
 * It's possible to add extensive help to any form element.
 * The string you provide can be in Markdown format,
 * empowering you to present a rich-text experience to the user,
 * including bullet points, hyperlinks, etc…
 * Read more on [Help](#/component/limel-help) component.
 *
 * :::note
 * Do not confuse `help` and `helperText`!
 * The helper text is a short description for the input fields
 * that becomes visible when the user click on the fields to provide
 * brief clues about the field or its expected value.
 *
 * It can also be used to display validation errors.
 * These errors will be displayed in red below the fields, without
 * requiring the users to click on the field.
 *
 * Check out the [Input field Component](#/component/limel-input-field)
 * examples, where we describe how to properly use `helperText`, and `placeholder`.
 * :::
 *
 * :::tip
 * When rendering a form using a schema, the `helperText`s are automatically
 * passed for all the fields based on the schema and validation errors.
 * The `description` specified for a field in the schema is used as
 * helper text while the field is shown as valid.
 * When there is validation feedback to provide to the user,
 * the field is instead marked as invalid with an error message that is displayed
 * in the place of the helper text.
 * :::
 *
 * @sourceFile help-form-schema.ts
 */
@Component({
    tag: 'limel-example-form-with-help',
    shadow: true,
})
export class NestedFormExample {
    @State()
    private formData: object = {};

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
