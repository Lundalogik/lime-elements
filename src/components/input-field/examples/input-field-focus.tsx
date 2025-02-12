import { Component, h, State } from '@stencil/core';

/**
 * Setting focus programmatically
 *
 * To set focus programmatically, call `.focus()` on the `limel-input-field`
 * element. Note that, for this to work, the `tabindex` property must be set
 * on the `limel-input-field`.
 *
 * - `tabindex="0"` means that the element should be focusable in sequential
 * keyboard navigation, after any positive tabindex values and its order is
 * defined by the document's source order.
 * - A _positive value_ means the element should be focusable in sequential
 * keyboard navigation, with its order defined by the value of the number.
 *
 * Read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex).
 */
@Component({
    tag: 'limel-example-input-field-focus',
    shadow: true,
})
export class InputFieldFocusExample {
    @State()
    private value: string;

    private inputField: HTMLLimelInputFieldElement;

    public render() {
        return [
            <limel-button
                onClick={this.setFocus}
                label={'Set focus'}
                style={{ 'margin-bottom': '1rem' }}
            />,
            <limel-input-field
                label="Set focus on me!"
                value={this.value}
                onChange={this.handleChange}
                ref={this.getInputFieldRef}
                tabindex="0"
            />,
        ];
    }

    private getInputFieldRef = (input: HTMLLimelInputFieldElement) => {
        this.inputField = input;
        return input;
    };

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };

    private setFocus = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        this.inputField.focus();
    };
}
