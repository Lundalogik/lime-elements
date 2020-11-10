import { ValidationStatus } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import { schema } from './basic-schema';

/**
 * Basic form with validation
 *
 * @link basic-schema.ts
 */
@Component({
    tag: 'limel-example-form',
    shadow: true,
})
export class FormExample {
    @State()
    private formData: object = {
        date: '1922-12-28',
    };

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
        console.log(
            'Basic form with validation - handleFormValidate:',
            event.detail
        );
    }

    private handleSubmit() {
        const json = JSON.stringify(this.formData, null, '    ');
        alert(`Sending information to villains...\n\n${json}`);
    }
}
