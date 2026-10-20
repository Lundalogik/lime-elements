import { Component, h, Host } from '@stencil/core';

/**
 * Accessibility
 *
 * A screen reader user cannot see the editor, so what they hear when focus
 * moves into it comes from the props you set. The editable area is a
 * [text box](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/textbox_role)
 * that accepts several lines, and the text editor hands it these props:
 *
 * - **`label`** is its
 *   [accessible name](https://developer.mozilla.org/en-US/docs/Glossary/Accessible_name),
 *   what a screen reader says first. The label that is drawn on the border of
 *   the editor is not read a second time.
 * - **`placeholder`** is the name when there is no `label`. It is common for a
 *   rich text editor to have no label, because the interface around it
 *   explains what it is for, as with a box for writing a comment. A
 *   placeholder such as "Write a comment…" is then what tells a screen reader
 *   user what the editor is for. The placeholder is also given to the
 *   editable area as its
 *   [placeholder](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-placeholder).
 * - **`helperText`** is its
 *   [description](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-description),
 *   which is read after the name when the editor gets focus. Use it for what
 *   the user needs to know: the format, a limit, or why the editor is
 *   invalid.
 * - **`required`**, **`invalid`** and **`disabled`** are read as states of the
 *   editable area. A `disabled` editor cannot be focused or typed in.
 *
 * Do not use the `placeholder` for anything the user must know. It disappears
 * as soon as the user starts to type, and some screen readers do not read it.
 * Put that in the `helperText`.
 *
 * Give every editor a `label` or a `placeholder`. An editor with neither has
 * no name, and a screen reader can only say that it is a text box.
 *
 * The three editors below show the three common cases. Inspect them in the
 * Accessibility panel of the browser's DevTools to see the name, the
 * description and the states, or move focus to them with a screen reader
 * running.
 */
@Component({
    tag: 'limel-example-text-editor-accessibility',
    shadow: true,
    styleUrl: 'text-editor-accessibility.scss',
})
export class TextEditorAccessibilityExample {
    public render() {
        return (
            <Host>
                <limel-text-editor
                    label="Message"
                    helperText="You can use markdown to format the message"
                />
                <limel-text-editor placeholder="Write a comment…" />
                <limel-text-editor
                    label="Summary"
                    helperText="Write at least one sentence"
                    required={true}
                    invalid={true}
                />
            </Host>
        );
    }
}
