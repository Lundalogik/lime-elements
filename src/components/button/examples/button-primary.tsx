import { Component, h } from '@stencil/core';

/**
 * Primary button
 *
 * Setting `primary={true}` creates a bold, filled button with the
 * theme's primary color as background. This makes it the most
 * visually prominent element on the screen.
 *
 * Use a primary button for the single most important action in a
 * given context — for example, "Save" in a form, "Send" in a
 * compose dialog, or "Continue" in a multi-step flow.
 *
 * ### When to use
 * - There should be **at most one** primary button per screen,
 *   dialog, or distinct section of action buttons.
 * - Use it for the action you _expect_ or _want_ users to take.
 * - It is acceptable to make a "safe" action primary even if
 *   it is not the most likely action, to help users avoid
 *   irreversible mistakes (e.g. making "Cancel" primary in a
 *   destructive confirmation dialog).
 *
 * ### When _not_ to use
 * - Do not mark multiple buttons as primary in the same context.
 *   If everything is emphasized, nothing stands out.
 * - Do not use `primary` for low-priority or auxiliary actions
 *   just because you want them to look "nicer".
 *
 * :::note
 * Read more about arranging primary and secondary actions
 * in our [Action buttons design guidelines](#/DesignGuidelines/action-buttons.md/).
 * :::
 */
@Component({
    tag: 'limel-example-button-primary',
    shadow: true,
})
export class ButtonPrimaryExample {
    public render() {
        return <limel-button label="My Button" primary={true} />;
    }
}
