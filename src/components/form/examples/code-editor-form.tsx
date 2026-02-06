import { ValidationStatus } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import { schema } from './code-editor-schema';

/**
 * Code editor with schema validation
 *
 * This example demonstrates how a form field that uses the code editor widget
 * displays validation feedback. The `payload` field is a free-form JSON object
 * with `additionalProperties: true`, which renders as a code editor. The schema
 * requires the object to include `method` and `url` properties.
 *
 * Try the following:
 * - Submit the form with an empty payload to see the required field error
 * - Enter invalid JSON to see the syntax error
 * - Enter valid JSON without `method` or `url` to see the schema error
 * - Enter valid JSON with both `method` and `url` to see the form validate
 *
 * @sourceFile code-editor-schema.ts
 */
@Component({
    tag: 'limel-example-code-editor-form',
    shadow: true,
})
export class CodeEditorFormExample {
    @State()
    private formData: Record<string, any> = {
        label: 'Get users',
        payload: {
            method: 'GET',
            url: 'https://api.example.com/users',
            headers: {
                Authorization: 'Bearer token123',
            },
        },
    };

    @State()
    private valid = true;

    public render() {
        return [
            <limel-form
                onChange={this.handleFormChange}
                onValidate={this.handleFormValidate}
                value={this.formData}
                schema={schema}
            />,
            <br />,
            <limel-button
                label="Send request"
                primary={true}
                disabled={!this.valid}
                onClick={this.handleSubmit}
            />,
            <limel-example-value value={this.formData} />,
        ];
    }

    private handleFormChange = (event: CustomEvent) => {
        this.formData = event.detail;
    };

    private handleFormValidate = (event: CustomEvent<ValidationStatus>) => {
        this.valid = event.detail.valid;
    };

    private handleSubmit = () => {
        const json = JSON.stringify(this.formData, null, '    ');
        alert(`Sending request...\n\n${json}`);
    };
}
