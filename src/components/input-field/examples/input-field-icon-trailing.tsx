import { Component, h, State } from '@stencil/core';

/**
 * Input Field with Trailing Icon & Action
 *
 * A trailing icon can be added along with an action for that trailing icon.
 */
@Component({
    tag: 'limel-example-input-field-icon-trailing',
    shadow: true,
})
export class InputFieldIconTrailingExample {
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
        console.log(`Sending email to ${this.value}`);
    }
}
