import { Component, State } from '@stencil/core';

const MIN_NAME_LENGTH = 5;
const MIN_AGE = 20;
const MAX_AGE = 50;

@Component({
    tag: 'limel-example-dialog-form',
    shadow: true,
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

    public render() {
        return [
            <limel-button
                primary={true}
                label="Open"
                onClick={() => {
                    this.isOpen = true;
                }}
            />,
            <limel-dialog
                heading="Registration"
                open={this.isOpen}
                onClose={() => {
                    this.isOpen = false;
                }}
                onClosing={() => {
                    console.log('dialog is closing now!');
                    this.isConfirmationOpen = true;
                }}
            >
                <form>
                    <p>
                        <limel-input-field
                            label="Name"
                            value={this.name}
                            required={true}
                            invalid={!this.nameValid()}
                            onChange={event => {
                                this.name = event.detail;
                            }}
                        />
                    </p>
                    <p>
                        <limel-input-field
                            label="Age"
                            value={this.age}
                            required={true}
                            invalid={!this.ageValid()}
                            onChange={event => {
                                this.age = event.detail;
                            }}
                        />
                    </p>
                    <p>
                        <limel-slider unit="%" value={this.percentage} />
                    </p>
                </form>
                <limel-button-group class="reverse-order" slot="button">
                    <limel-button
                        primary={true}
                        label="Save"
                        disabled={!this.nameValid() || !this.ageValid()}
                        onClick={this.submitForm}
                    />
                    <limel-button label="Cancel" onClick={this.closeDialog} />
                </limel-button-group>
            </limel-dialog>,
            <limel-dialog
                open={this.isConfirmationOpen}
                onClose={() => {
                    this.isConfirmationOpen = false;
                }}
            >
                <p>Are you sure you want to close this? </p>
                <limel-button-group slot="button">
                    <limel-button
                        label="Yes"
                        onClick={() => {
                            this.isConfirmationOpen = false;
                            this.isOpen = false;
                        }}
                    />
                    <limel-button
                        label="No"
                        onClick={() => {
                            this.isOpen = true;
                            this.isConfirmationOpen = false;
                        }}
                    />
                </limel-button-group>
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

    private closeDialog = () => {
        this.isOpen = false;
    };
}
