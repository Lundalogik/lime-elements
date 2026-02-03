import { Component, h, Host, State } from '@stencil/core';
import type { LimelHotkeyTriggerDetail } from '@limetech/lime-elements';

/**
 * Basic example
 *
 * The value is passed as a string, indicating which hotkey to listen for.
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
 * - `ctrl` means “Control specifically” on all platforms.
 * - `cmd` or `command` always render as <kbd>⌘</kbd> (even on Windows/Linux),
 * and are normalized as aliases for `meta` when matching.
 * - Matching hotkeys call `event.preventDefault()` by default, to avoid browser
 * shortcuts (like Save/Print) firing together with your action. Set
 * `preventBrowserDefault={false}` if you need to keep browser defaults.
 * :::
 */
@Component({
    tag: 'limel-example-hotkey-basic',
    shadow: true,
    styleUrl: 'hotkey-basic.scss',
})
export class HotkeyBasicExample {
    @State()
    private lastSelectedHotkey: string;

    public render() {
        return (
            <Host onHotkeyTrigger={this.handleHotkeyTrigger}>
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
                <limel-example-value
                    label="Last triggered hotkey"
                    value={this.lastSelectedHotkey}
                />
            </Host>
        );
    }

    private handleHotkeyTrigger = (
        event: CustomEvent<LimelHotkeyTriggerDetail>
    ) => {
        this.lastSelectedHotkey = event.detail.hotkey;
    };
}
