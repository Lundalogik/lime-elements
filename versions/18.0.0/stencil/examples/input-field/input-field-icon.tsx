import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-input-field-icon',
    shadow: true,
})
export class InputFieldIconExample {
    @State()
    private value;

    public render() {
        return (
            <limel-input-field
                label="Email address"
                type="email"
                value={this.value}
                trailingIcon="filled_message"
                onChange={event => {
                    this.value = event.detail;
                }}
                onAction={() => {
                    console.log(`sending email to ${this.value}`);
                }}
            />
        );
    }
}
