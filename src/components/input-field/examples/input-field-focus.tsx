import { Component, h, State } from '@stencil/core';

/**
 * How to set focus on input fields
 *
 * The `tabindex` must be set to be able to set focus on the input field.
 */
@Component({
    tag: 'limel-example-input-field-focus',
    shadow: true,
    styleUrl: 'input-field.scss',
})
export class InputFieldFocusExample {
    @State()
    private value: string;

    private inputField: HTMLLimelInputFieldElement;

    constructor() {
        this.setFocus = this.setFocus.bind(this);
    }

    public render() {
        return [
            <limel-input-field
                label="Set focus on me!"
                value={this.value}
                onChange={this.changeHandler}
                ref={(input) => (this.inputField = input)}
                tabindex="0"
            />,
            <p>
                <limel-flex-container justify="end">
                    <limel-button onClick={this.setFocus} label={'Set focus'} />
                </limel-flex-container>
            </p>,
        ];
    }

    private changeHandler(event: CustomEvent<string>) {
        this.value = event.detail;
    }

    private setFocus(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
        this.inputField.focus();
    }
}
