import { Component, h, Host } from '@stencil/core';

/**
 * Visualizing a keyboard shortcut
 *
 * Use the `hotkey` property to render a keyboard shortcut inside the tooltip,
 * next to the `label` (and the optional `helperLabel`). The keyboard shortcut
 * that you will define will automatically have platform-aware glyphs.
 * For example, `meta+c` renders as <kbd>⌘</kbd> <kbd>C</kbd> on macOS and
 * as <kbd>⊞ Win</kbd> <kbd>+</kbd> <kbd>C</kbd> on Windows.
 *
 * :::important
 * The `hotkey` property is for visualization purposes only.
 * The tooltip does **not** listen for, or handle any keyboard events
 * on its own. Catching the key combination and running
 * the associated action is the responsibility of the consumer of the tooltip.
 * :::
 *
 * :::note
 * 1. `meta` means the Meta key.
 *   It is rendered as <kbd>⌘</kbd> on Apple devices, and <kbd>⊞ Win</kbd> on
 *   Windows/Linux. (`cmd`, `command`, `win`, `windows` are aliases for `meta`.)
 *
 *   If you want "primary modifier" hotkeys (e.g. <kbd>⌘</kbd> on macOS and
 *   <kbd>Ctrl</kbd> on Windows/Linux), detect OS in your application and
 *   provide different `hotkey` values.
 *
 *   `ctrl` means the Control key on all platforms.
 *
 * 2. All browsers and operating systems have some built-in hotkeys
 *   that may conflict with your defined hotkeys.
 *   For example, `cmd+p` is often used to print the current page.
 *   Make sure to choose hotkeys that do not conflict with common browser
 *   hotkeys, and user's expected behavior.
 * :::
 */
@Component({
    tag: 'limel-example-tooltip-hotkey',
    shadow: true,
    styleUrl: 'tooltip-max-character.scss',
})
export class TooltipHotkeyExample {
    public render() {
        return (
            <Host>
                <limel-button icon="save" id="tooltip-hotkey-1" />
                <limel-tooltip
                    label="Save"
                    hotkey="ctrl+s"
                    elementId="tooltip-hotkey-1"
                />
                <limel-button icon="save_all" id="tooltip-hotkey-2" />
                <limel-tooltip
                    label="Save as"
                    helperLabel="Save with a new name or location"
                    hotkey="meta+shift+s"
                    elementId="tooltip-hotkey-2"
                />
            </Host>
        );
    }
}
