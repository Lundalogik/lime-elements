import { Component, h, Host } from '@stencil/core';

/**
 * Assistive text for screen readers
 *
 * Sometimes list items have short labels that only make sense when combined
 * with their icons. For example, a menu item might display "Person" with a
 * plus icon to indicate "Create a new person".
 *
 * While this works visually, screen reader users don't have access to the
 * icon's meaning. The `assistiveText` property lets you provide an
 * alternative description that is only announced by screen readers.
 *
 * :::tip
 * When `assistiveText` is provided:
 * - The visible `text` and `secondaryText` are hidden from screen readers
 * - Only the `assistiveText` is announced
 * - The visual appearance remains unchanged
 * :::
 *
 * :::note
 * Use a screen reader (like VoiceOver on macOS or NVDA on Windows) to test
 * this example. You'll hear the assistive text instead of the visible labels.
 * :::
 */
@Component({
    tag: 'limel-example-list-item-assistive-text',
    shadow: true,
    styleUrl: 'list-item-basic.scss',
})
export class ListItemAssistiveTextExample {
    public render() {
        return (
            <Host>
                <p class="example-description">
                    Use a screen reader to hear the assistive text. The visual
                    labels show abbreviated text, but screen readers will
                    announce the full descriptions.
                </p>
                <ul>
                    <limel-list-item
                        value={1}
                        tabindex="0"
                        text="Person"
                        icon="add"
                        assistiveText="Create a new person"
                    />
                    <limel-list-item
                        value={2}
                        tabindex="0"
                        text="Company"
                        icon="add"
                        assistiveText="Create a new company"
                    />
                    <limel-list-item
                        value={3}
                        tabindex="0"
                        text="Delete"
                        icon="delete_sign"
                        assistiveText="Delete this item permanently"
                    />
                    <limel-list-item
                        value={4}
                        tabindex="0"
                        text="Regular item (no assistive text)"
                        secondaryText="This uses the visible text for screen readers"
                        icon="info"
                    />
                </ul>
            </Host>
        );
    }
}
