import { Component, h, Host } from '@stencil/core';

/**
 * Basic example
 *
 * The value is passed as a string, indicating which hotkey to display.
 *
 * The component will automatically detect the operating system, and
 * render the hotkey accordingly, using standard glyphs to save space.
 *
 * For example, the "meta" key will be rendered as <kbd>⌘</kbd> on macOS,
 * and as <kbd>⊞ Win</kbd> on Windows/Linux. Or the "alt" key will be rendered
 * as <kbd>⌥</kbd> on macOS, and as <kbd>Alt</kbd> on Windows.
 *
 * :::note
 * `meta` always means the actual Meta key.
 *
 * This component will render `meta` using platform conventions:
 * - macOS/iOS/iPadOS: <kbd>⌘</kbd>
 * - Windows/Linux: <kbd>⊞ Win</kbd>
 *
 * If you want a hotkey that differs between operating systems (for example
 * ⌘+C on macOS and Ctrl+C on Windows/Linux), detect the OS in your application
 * and pass the appropriate hotkey string.
 *
 * - `ctrl` means "Control specifically" on all platforms.
 * - `cmd` or `command` always render as <kbd>⌘</kbd> (even on Windows/Linux).
 * :::
 *
 * :::important
 * This component is **display-only**. It does not listen for or handle
 * any keyboard events. Keyboard event handling is the responsibility
 * of the parent component (e.g. `limel-menu` or `limel-select`).
 * :::
 */
@Component({
    tag: 'limel-example-hotkey-basic',
    shadow: true,
    styleUrl: 'hotkey-basic.scss',
})
export class HotkeyBasicExample {
    public render() {
        return (
            <Host>
                <limel-hotkey value="s" />
                <limel-hotkey value="alt+s" />
                <limel-hotkey value="meta+c" />
                <limel-hotkey value="meta+alt+s" />
                <limel-hotkey value="meta+enter" />
                <limel-hotkey value="cmd+enter" />
                <limel-hotkey value="ctrl+shift+c" />
                <limel-hotkey value="f1" />
                <limel-hotkey value="tab" />
                <limel-hotkey value="+" />
                <limel-hotkey value="-" />
            </Host>
        );
    }
}
