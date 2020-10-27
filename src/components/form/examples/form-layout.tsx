import { ValidationStatus } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import { schema } from './schema-layout';

/**
 * Layout
 *
 * @link schema-layout.ts
 */
@Component({
    tag: 'limel-example-form-layout',
    shadow: true,
})
export class FormLayoutExample {
    @State()
    private formData: object = {};

    @State()
    private valid = true;

    constructor() {
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleFormValidate = this.handleFormValidate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

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
                label="Submit"
                primary={true}
                disabled={!this.valid}
                onClick={this.handleSubmit}
            />,
            <limel-example-value value={this.formData} />,
        ];
    }

    private handleFormChange(event) {
        this.formData = event.detail;
    }

    private handleFormValidate(event: CustomEvent<ValidationStatus>) {
        this.valid = event.detail.valid;
        console.log(event.detail);
    }

    private handleSubmit() {
        const json = JSON.stringify(this.formData, null, '    ');
        alert(`Sending information to villains...\n\n${json}`);
    }
}
