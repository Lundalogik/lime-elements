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
