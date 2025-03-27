import {
    FormSchema,
    LimelFormCustomEvent,
    ValidationStatus,
} from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

const MIN_NAME_LENGTH = 5;
const MIN_AGE = 20;
const MAX_AGE = 50;

interface FormValue {
    name: string;
    age: number;
    percentage: number;
    color: string;
}

/**
 * Dialog with form and confirmation dialog
 *
 * This example demonstrates how to use a `limel-form` inside a `limel-dialog`.
 * It also shows a confirmation dialog when the user closes the main dialog
 * without saving.
 */
@Component({
    tag: 'limel-example-dialog-form',
    styleUrl: 'dialog-form.scss',
    shadow: true,
})
export class DialogFormExample {
    @State()
    private isOpen = false;

    @State()
    private isFormValid = true;

    @State()
    private formValue: FormValue = {
        name: 'Harry Potter 🪄',
        age: 44,
        percentage: 40,
        color: 'red',
    };

    @State()
    private isConfirmationOpen = false;

    private isSaving = false;

    private formSchema: FormSchema<FormValue> = {
        type: 'object',
        lime: {
            layout: {
                type: 'grid',
                columns: 2,
            },
        },
        properties: {
            name: {
                type: 'string',
                title: 'Name',
                minLength: MIN_NAME_LENGTH,
            },
            age: {
                type: 'number',
                title: 'Age',
                minimum: MIN_AGE,
                maximum: MAX_AGE,
            },
            percentage: {
                type: 'number',
                title: 'Percentage',
                lime: {
                    layout: {
                        colSpan: 'all',
                    },
                    component: {
                        name: 'limel-slider',
                        props: {
                            unit: '%',
                        },
                    },
                },
            },
            color: {
                type: 'string',
                title: 'Favorite color',
                oneOf: [
                    {
                        type: 'string',
                        const: 'red',
                        title: 'Red',
                    },
                    {
                        type: 'string',
                        const: 'yellow',
                        title: 'Yellow',
                    },
                    {
                        type: 'string',
                        const: 'green',
                        title: 'Green',
                    },
                    {
                        type: 'string',
                        const: 'blue',
                        title: 'Blue',
                    },
                    {
                        type: 'string',
                        const: 'black',
                        title: 'Black',
                    },
                ],
            },
        },
    };

    public render() {
        return [
            <limel-button
                primary={true}
                label="Open"
                onClick={this.openDialog}
            />,
            <limel-dialog
                class="registration-dialog"
                heading="Registration"
                open={this.isOpen}
                onClose={this.closeDialog}
                onClosing={this.onClosing}
            >
                <limel-form
                    value={this.formValue}
                    schema={this.formSchema}
                    onChange={this.handleFormChange}
                    onValidate={this.handleFormValidation}
                />
                <limel-button
                    label="Cancel"
                    onClick={this.closeDialog}
                    slot="button"
                />
                <limel-button
                    primary={true}
                    label="Save"
                    disabled={!this.isFormValid}
                    onClick={this.submitForm}
                    slot="button"
                />
            </limel-dialog>,
            <limel-dialog
                open={this.isConfirmationOpen}
                onClose={this.closeConfirmation}
            >
                <p>Are you sure you want to close this? </p>
                <limel-button
                    label="No"
                    onClick={this.onConfirmNegative}
                    slot="button"
                />
                <limel-button
                    label="Yes"
                    onClick={this.onConfirmPositive}
                    slot="button"
                />
            </limel-dialog>,
        ];
    }

    private handleFormChange = (event: LimelFormCustomEvent<FormValue>) => {
        this.formValue = event.detail;
    };

    private handleFormValidation = (
        event: LimelFormCustomEvent<ValidationStatus>,
    ) => {
        console.debug('Validation status:', event.detail);
        this.isFormValid = event.detail.valid;
    };

    private submitForm = () => {
        this.isSaving = true;
        alert(
            `${this.formValue?.name} is ${this.formValue?.age} years old. Favorite color is ${this.formValue?.color}.`,
        );
        this.closeDialog();
    };

    private openDialog = () => {
        this.isOpen = true;
    };

    private closeDialog = () => {
        this.isOpen = false;
    };

    private onClosing = () => {
        console.log('dialog is closing now!');
        if (!this.isSaving) {
            this.isConfirmationOpen = true;
        }

        this.isSaving = false;
    };

    private closeConfirmation = () => {
        this.isConfirmationOpen = false;
    };

    private onConfirmPositive = () => {
        this.isConfirmationOpen = false;
        this.isOpen = false;
    };

    private onConfirmNegative = () => {
        this.isOpen = true;
        this.isConfirmationOpen = false;
    };
}
