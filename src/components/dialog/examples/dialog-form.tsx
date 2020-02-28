import { Component, h, State } from '@stencil/core';

const MIN_NAME_LENGTH = 5;
const MIN_AGE = 20;
const MAX_AGE = 50;

@Component({
    tag: 'limel-example-dialog-form',
    shadow: true,
    styleUrl: 'dialog-form.scss',
})
export class DialogFormExample {
    @State()
    private isOpen = false;

    @State()
    private name = '';

    @State()
    private age: string;

    @State()
    private percentage = 45;

    @State()
    private isConfirmationOpen = false;

    constructor() {
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.onClosing = this.onClosing.bind(this);
        this.nameOnChange = this.nameOnChange.bind(this);
        this.ageOnChange = this.ageOnChange.bind(this);
        this.closeConfirmation = this.closeConfirmation.bind(this);
        this.onConfirmPositive = this.onConfirmPositive.bind(this);
        this.onConfirmNegative = this.onConfirmNegative.bind(this);
    }

    public render() {
        return [
            <limel-button
                primary={true}
                label="Open"
                onClick={this.openDialog}
            />,
            <limel-dialog
                heading="Registration"
                open={this.isOpen}
                onClose={this.closeDialog}
                onClosing={this.onClosing}
            >
                <form>
                    <p>
                        <limel-input-field
                            label="Name"
                            value={this.name}
                            required={true}
                            invalid={!this.nameValid()}
                            onChange={this.nameOnChange}
                        />
                    </p>
                    <p>
                        <limel-input-field
                            label="Age"
                            value={this.age}
                            required={true}
                            invalid={!this.ageValid()}
                            onChange={this.ageOnChange}
                            type="number"
                        />
                    </p>
                    <p>
                        <limel-slider unit="%" value={this.percentage} />
                    </p>
                </form>
                <limel-flex-container slot="button" reverse={true}>
                    <limel-button
                        primary={true}
                        label="Save"
                        disabled={!this.nameValid() || !this.ageValid()}
                        onClick={this.submitForm}
                    />
                    <limel-button label="Cancel" onClick={this.closeDialog} />
                </limel-flex-container>
            </limel-dialog>,
            <limel-dialog
                open={this.isConfirmationOpen}
                onClose={this.closeConfirmation}
            >
                <p>Are you sure you want to close this? </p>
                <limel-flex-container
                    justify="end"
                    reverse={true}
                    slot="button"
                >
                    <limel-button
                        label="Yes"
                        onClick={this.onConfirmPositive}
                    />
                    <limel-button label="No" onClick={this.onConfirmNegative} />
                </limel-flex-container>
            </limel-dialog>,
        ];
    }

    private nameValid() {
        return this.name.length >= MIN_NAME_LENGTH;
    }

    private ageValid() {
        return +this.age > MIN_AGE && +this.age < MAX_AGE;
    }

    private submitForm = () => {
        alert(`${this.name} is ${this.age} years old`);
        this.closeDialog();
    };

    private openDialog() {
        this.isOpen = true;
    }

    private closeDialog() {
        this.isOpen = false;
    }

    private onClosing() {
        console.log('dialog is closing now!');
        this.isConfirmationOpen = true;
    }

    private nameOnChange(event) {
        this.name = event.detail;
    }

    private ageOnChange(event) {
        this.age = event.detail;
    }

    private closeConfirmation() {
        this.isConfirmationOpen = false;
    }

    private onConfirmPositive() {
        this.isConfirmationOpen = false;
        this.isOpen = false;
    }

    private onConfirmNegative() {
        this.isOpen = true;
        this.isConfirmationOpen = false;
    }
}
