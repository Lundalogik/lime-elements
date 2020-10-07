import { Component, h, State } from '@stencil/core';

/**
 * Input Field with Icon Action
 */
@Component({
    tag: 'limel-example-input-field-icon',
    shadow: true,
})
export class InputFieldIconExample {
    @State()
    private value;

    constructor() {
        this.onChange = this.onChange.bind(this);
        this.onAction = this.onAction.bind(this);
    }

    public render() {
        return (
            <limel-input-field
                label="Email address"
                type="email"
                value={this.value}
                trailingIcon="filled_message"
                onChange={this.onChange}
                onAction={this.onAction}
            />
        );
    }

    private onChange(event) {
        this.value = event.detail;
    }

    private onAction() {
        console.log(`sending email to ${this.value}`);
    }
}
