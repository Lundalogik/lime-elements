import { Component, h, State } from '@stencil/core';

/**
 * Input Field with a placeholder
 *
 * The placeholder text is displayed inside the input field,
 * when the field is focused and empty.
 *
 * :::tip
 * A `placeholder` text is good for providing hints and examples about the expected input.
 * While the `helperText` is better for providing instructions.
 * :::
 *
 * Unlike `helperText` which is constantly visible while the user is typing
 * inside the field, the `placeholder` text disappears as soon as the user has
 * input anything.
 *
 * :::note
 * Make an informed decision when using `placeholder` instead of `helperText`!
 * You may have good intentions to reduce clutter on the user interface
 * and use a placeholder text, because it will disappear after user has started typing.
 * However, if the additional tips or instructions that you are trying to provide is
 * crucial or hard to remember, it is better to display them as helper text instead.
 *
 * This is because disappearing crucial information will strains users’ short-term memory.
 * In a form with many fields, users can easily forget
 * what each field was for. Especially if a field has validations that fail
 * for example after submitting. Instructions that are not visible anymore will make it
 * hard for the user to realize what the problem is or how to solve it.
 * :::
 * :::warning
 * If no `label` is provided, then the placeholder text will be displayed even if the
 * input field is not focused.
 *
 * However, this does not mean that you should use this
 * as a hack, to create a minimalistic and clean user interface. Not providing labels
 * will cause accessibility issues for users of assistive technologies,
 * and strains users’ short-term memory as explained above.
 * Additionally, users may confuse the placeholder text, as an automatically
 * inputted value, and skip filling in information.
 * :::
 */
@Component({
    tag: 'limel-example-input-field-placeholder',
    shadow: true,
})
export class InputFieldPlaceholderExample {
    @State()
    private value: string;

    public render() {
        return (
            <limel-input-field
                label="Your personal identity number"
                placeholder="example: 19990101-1234"
                helperText="Use correct format (12 digits, and a dash after your birth date)"
                value={this.value}
                onChange={this.handleChange}
            />
        );
    }

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };
}
