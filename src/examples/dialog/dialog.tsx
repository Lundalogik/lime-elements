import { Component, State, Element } from '@stencil/core';

@Component({
    tag: 'limel-example-dialog',
    shadow: true
})
export class DialogExample {

    @State() dialogOpen = false;
    @State() isValid = false;

    @State() name = '';
    @State() age: number;

    @Element() element: HTMLElement;

    render() {
        return [
            <limel-button primary
                label="Open"
                onClick={() => this.dialogOpen = true} />,

            <limel-dialog
                open={this.dialogOpen}
                onClose={() => this.dialogOpen = false}>
                <form>
                    <label>Name: </label>
                    <input
                        tabindex="0"
                        type="text"
                        value={this.name}
                        onInput={this.handleChangeName}
                    />
                    <br/>
                    <label>Age: </label>
                    <input
                        type="text"
                        value={this.age}
                        onInput={this.handleChangeColor}
                    />
                </form>
                <limel-button-group
                    reverse-order
                    slot="button"
                >
                    <limel-button
                        primary
                        label="Save"
                        disabled={!this.isValid}
                        onClick={this.submitForm}
                    />
                    <limel-button
                        label="Cancel"
                        onClick={this.closeDialog}
                    />
                </limel-button-group>
            </limel-dialog>
        ];
    }

    /**
     *
     */
    handleChangeName = event => {
        this.name = event.target.value;
        this.validate();
    };

    /**
     *
     */
    handleChangeColor = (event) => {
        this.age = event.target.value;
        this.validate();
    };

    /**
     *
     */
    validate = () => {
        this.isValid = (this.name.length >= 5) &&
            (this.age > 20 && this.age < 50);
    };

    /**
     *
     */
    submitForm = () => {
        alert(`${this.name} is ${this.age} years old`);
        this.closeDialog();
    };

    /**
     *
     */
    closeDialog = () => {
        this.dialogOpen = false;
    };
}
