import { Component, h, State } from '@stencil/core';

const MIN_LENGTH = 6;

/**
 * Input Field with Leading Icon
 *
 * A leading icon can be used to visually "decorate" the input field. The
 * purpose for adding a leading icon should be to help the user understand what
 * the field is for.
 *
 * In this example, we use a map icon in addition to the "Address" label, to
 * indicate that this field is meant for a physical address.
 *
 * The example has a minimum length just to show what an invalid field looks
 * like.
 */
@Component({
    tag: 'limel-example-input-field-icon-leading',
    shadow: true,
})
export class InputFieldIconLeadingExample {
    @State()
    private value;

    constructor() {
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return (
            <limel-input-field
                label="Address"
                value={this.value}
                minlength={MIN_LENGTH}
                helperText={`Please enter at least ${MIN_LENGTH} characters!`}
                leadingIcon="map_marker"
                onChange={this.onChange}
            />
        );
    }

    private onChange(event) {
        this.value = event.detail;
    }
}
