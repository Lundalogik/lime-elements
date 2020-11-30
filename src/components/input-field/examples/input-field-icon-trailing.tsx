import { Component, h, State } from '@stencil/core';

/**
 * Input Field with Trailing Icon & Action
 *
 * A trailing icon can be added to input fields along with an action
 * for that trailing icon.
 * :::note
 * Use trailing icons only when you intend to have an action associated with them.
 * Trailing icons of input fields will get an interactive visual effect when
 * hovered to hint users that they are clickable.
 *
 * Therefore, a purely ornamental trailing icon that has this interactive effect
 * will be confusing for users.
 * :::
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
