import { Component, State } from '@stencil/core';

const MIN_NAME_LENGTH = 5;
const MIN_AGE = 20;
const MAX_AGE = 50;

@Component({
    tag: 'limel-example-dialog',
    shadow: true,
    styleUrl: 'dialog.scss',
})
export class DialogExample {
    @State()
    private basicDialogOpen = false;
    @State()
    private headingDialogOpen = false;

    @State()
    private name = '';

    @State()
    private age: string;

    public render() {
        return [
            <section>
                <h3>Basic Usage</h3>
                <limel-button
                    primary={true}
                    label="Open"
                    onClick={() => {
                        this.basicDialogOpen = true;
                    }}
                />
                <limel-dialog
                    open={this.basicDialogOpen}
                    onClose={() => {
                        this.basicDialogOpen = false;
                    }}
                >
                    <p>This is a simple alert-dialog.</p>
                    <limel-button-group slot="button">
                        <limel-button
                            label="Ok"
                            onClick={() => {
                                this.basicDialogOpen = false;
                            }}
                        />
                    </limel-button-group>
                </limel-dialog>
            </section>,
            <section>
                <h3>With Heading</h3>
                <limel-button
                    primary={true}
                    label="Open"
                    onClick={() => {
                        this.headingDialogOpen = true;
                    }}
                />
                <limel-dialog
                    heading="Registration"
                    open={this.headingDialogOpen}
                    onClose={() => {
                        this.headingDialogOpen = false;
                    }}
                >
                    <form>
                        <p>
                            <limel-text-field
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
                            <limel-text-field
                                label="Age"
                                value={this.age}
                                required={true}
                                invalid={!this.ageValid()}
                                onChange={event => {
                                    this.age = event.detail;
                                }}
                            />
                        </p>
                    </form>
                    <limel-button-group class="reverse-order" slot="button">
                        <limel-button
                            primary={true}
                            label="Save"
                            disabled={!this.nameValid() || !this.ageValid()}
                            onClick={this.submitForm}
                        />
                        <limel-button
                            label="Cancel"
                            onClick={this.closeDialog}
                        />
                    </limel-button-group>
                </limel-dialog>
            </section>,
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
        this.headingDialogOpen = false;
    };
}
