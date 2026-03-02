import {
    LimelSelectCustomEvent,
    Option,
    ListSeparator,
} from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Select with option hotkeys.
 *
 * Use `hotkey` on options to bind keyboard interaction while the select
 * dropdown is open.
 *
 * :::note
 * 1. Hotkeys work only while the custom dropdown is open.
 * 2. On mobile/iOS, `limel-select` uses a native `<select>`, so option
 * hotkeys are not active.
 * 3. Some keys are reserved for dropdown navigation and are ignored as
 * option hotkeys: `tab` and arrow keys are always reserved; `enter`, `escape`,
 * and `space` are reserved unless used with a modifier (for example
 * `alt+enter`).
 * :::
 *
 * :::important
 * `meta` means the Meta key.
 * It is rendered as <kbd>⌘</kbd> on Apple devices and <kbd>⊞ Win</kbd> on
 * Windows/Linux. (`cmd`, `command`, `win`, `windows` are aliases for `meta`.)
 *
 * `ctrl` means the Control key on all platforms.
 *
 * Choose hotkeys that do not conflict with common browser shortcuts.
 * :::
 */
@Component({
    shadow: true,
    tag: 'limel-example-select-hotkeys',
})
export class SelectHotkeysExample {
    @State()
    private value: Option;

    private options: (Option | ListSeparator)[] = [
        {
            text: 'Started',
            value: 'started',
            hotkey: 's',
        },
        {
            text: 'In progress',
            value: 'in-progress',
            hotkey: 'p',
        },
        {
            text: 'Blocked',
            value: 'blocked',
            hotkey: 'b',
        },
        {
            text: 'Done',
            value: 'done',
            hotkey: 'd',
        },
        { separator: true },
        {
            text: 'Closed',
            secondaryText: 'as not planned',
            value: 'closed',
            hotkey: 'cmd+d',
        },
    ];

    public render() {
        return (
            <Host>
                <limel-select
                    label="Task status"
                    value={this.value}
                    options={this.options}
                    onChange={this.handleChange}
                />
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    private handleChange = (event: LimelSelectCustomEvent<Option>) => {
        this.value = event.detail;
    };
}
