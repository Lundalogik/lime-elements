import { Component, h, Host, State } from '@stencil/core';

/**
 * Accessing text selection
 *
 * The `limel-input-field` component exposes three async methods that
 * provide access to the current text selection:
 *
 * - `getSelectionStart()`: Returns the start position of the current text selection
 * - `getSelectionEnd()`: Returns the end position of the current text selection
 * - `getSelectionDirection()`: Returns the direction of the selection (`'forward'`, `'backward'`, or `'none'`)
 *
 * These methods allow you to interact with the input field's text selection
 * without needing to access the shadow DOM. A common use case is inserting text
 * at the cursor position or replacing the selected text.
 *
 * :::note
 * The selection methods are async, so there's a small delay before the values
 * are returned. In most browsers, selection state is preserved even when the
 * input loses focus. However, some mobile browsers or older engines may reset
 * `selectionStart`/`selectionEnd` on blur. If you're building for such environments,
 * consider capturing the selection synchronously via native DOM APIs before any
 * action that might cause blur.
 * :::
 */
@Component({
    tag: 'limel-example-input-field-selection',
    shadow: true,
})
export class InputFieldSelectionExample {
    @State()
    private value =
        'Select some text or place the cursor, then click the button to insert text!';

    private inputField: HTMLLimelInputFieldElement;

    public render() {
        return (
            <Host>
                <limel-input-field
                    label="Text field"
                    value={this.value}
                    onChange={this.handleChange}
                    ref={this.getInputFieldRef}
                    style={{ 'margin-bottom': '1rem' }}
                />
                <limel-button
                    onClick={this.insertTextAtCursor}
                    label="Insert '[INSERTED]' at cursor"
                />
            </Host>
        );
    }

    private getInputFieldRef = (input: HTMLLimelInputFieldElement) => {
        this.inputField = input;
    };

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };

    private insertTextAtCursor = async () => {
        if (!this.inputField) {
            return;
        }

        // Read both selection values together
        const [selectionStart, selectionEnd] = await Promise.all([
            this.inputField.getSelectionStart(),
            this.inputField.getSelectionEnd(),
        ]);

        const start = selectionStart ?? this.value.length;
        const end = selectionEnd ?? this.value.length;
        const textToInsert = '[INSERTED]';

        // Insert text at cursor position or replace selected text
        const newValue =
            this.value.slice(0, start) + textToInsert + this.value.slice(end);

        this.value = newValue;

        // Set focus back to the input field after insertion
        requestAnimationFrame(() => {
            this.inputField.focus();
        });
    };
}
