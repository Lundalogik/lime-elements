import { Component, h, State } from '@stencil/core';
const MIN_LENGTH = 6;

@Component({
    tag: 'limel-example-input-field-error-icon',
    shadow: true,
})
export class InputFieldErrorIconExample {
    @State()
    private value;

    constructor() {
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return (
            <limel-input-field
                label="Text Field"
                minlength={MIN_LENGTH}
                helperText="Please enter at least 6 characters!"
                value={this.value}
                onChange={this.onChange}
            />
        );
    }

    private onChange(event) {
        this.value = event.detail;
    }
}
