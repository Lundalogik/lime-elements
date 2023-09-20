import { Component, h, State } from '@stencil/core';
import { ValidationStatus } from '@limetech/lime-elements';

/**
 * Dynamic schema
 */
@Component({
    tag: 'limel-example-dynamic-form',
    shadow: true,
    styleUrl: 'dynamic-form.scss',
})
export class DynamicFormExample {
    @State()
    private formData: object = {
        title: 'Test',
    };
    @State()
    private errors = null;

    @State()
    private schema: any = {
        $id: 'test',
        title: 'My form',
        description: 'Lorem ipsum dolor sit amet',
        type: 'object',
        required: ['title'],
        properties: {
            title: {
                type: 'string',
                title: 'Title',
                default: 'A new task',
                description: 'Lorem ipsum dolor sit amet',
                minLength: 5,
            },
            done: { type: 'boolean', title: 'Done?', default: false },
        },
    };

    @State()
    private text: string;

    constructor() {
        this.text = JSON.stringify(this.schema, null, '    ');
    }

    public render() {
        return [
            <textarea onChange={this.handleTextChange}>{this.text}</textarea>,
            <br />,
            <limel-form
                onChange={this.handleFormChange}
                onValidate={this.handleValidate}
                value={this.formData}
                schema={this.schema}
            />,
            <limel-example-value value={this.formData} />,
            <limel-example-value label="Errors" value={this.errors} />,
        ];
    }

    private handleFormChange = (event: CustomEvent) => {
        this.formData = event.detail;
    };

    private handleTextChange = (event) => {
        this.text = event.target.value;
        try {
            const json = JSON.parse(event.target.value);
            if (json) {
                this.schema = json;
            }
        } catch (e) {
            console.log(e);
        }
    };

    private handleValidate = (event: CustomEvent<ValidationStatus>) => {
        this.errors = event.detail;
    };
}
