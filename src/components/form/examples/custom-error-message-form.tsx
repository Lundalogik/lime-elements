import { ValidationStatus, FormError } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import { schema } from './custom-error-message-schema';

/**
 * Form with custom error message
 *
 * @sourceFile custom-error-message-schema.ts
 */
@Component({
    tag: 'limel-example-custom-error-message',
    shadow: true,
})
export class CustomErrorMessageFormExample {
    @State()
    private formData: object = {
        personalIdentityNumber: '',
    };

    @State()
    private valid = true;

    public render() {
        return [
            <limel-form
                onValidate={this.handleFormValidate}
                onChange={this.handleFormChange}
                value={this.formData}
                schema={schema}
                transformErrors={this.transformErrors}
            />,
            <br />,
            <limel-button
                label="Submit"
                primary={true}
                disabled={!this.valid}
                onClick={this.handleSubmit}
            />,
        ];
    }

    private handleFormChange = (event) => {
        this.formData = event.detail;
    };

    private handleSubmit = () => {
        const json = JSON.stringify(this.formData, null, '    ');
        alert(`Sending information to villains...\n\n${json}`);
    };

    private handleFormValidate = (event: CustomEvent<ValidationStatus>) => {
        this.valid = event.detail.valid;
    };

    private transformErrors = (errors: FormError[]): FormError[] => {
        return errors.map((error) => {
            if (
                error.name === 'pattern' &&
                error.property === '.personalIdentityNumber'
            ) {
                error.message = 'Invalid format, use YYYYMMDD-NNNN';
            }

            return error;
        });
    };
}
