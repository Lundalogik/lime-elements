import {
    MenuItem,
    ListSeparator,
    LimelMenuCustomEvent,
} from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Menu with supporting hotkeys
 *
 * Use `hotkey` to bind actual keyboard interaction while the menu is open.
 *
 * :::note
 * 1. `commandText` is ignored and won't render, when `hotkey` is defined.
 * 2. The `hotkey` works only when the menu is open. Adding a hotkey does not
 * trigger the action which is tied to a menu item selectable from
 * anywhere in the application.
 * 3. Some keys are reserved for menu interaction and will be ignored as hotkeys:
 * `tab` and the arrow keys are always reserved; `enter`, `escape`, and `space`
 * are reserved unless used with a modifier (e.g. `alt+enter`).
 * :::
 *
 * :::important
 * 1. `meta` means the Meta key.
 * It is rendered as <kbd>⌘</kbd> on Apple devices, and <kbd>⊞ Win</kbd> on
 * Windows/Linux. (`cmd`, `command`, `win`, `windows` are aliases for `meta`.)
 *
 * If you want "primary modifier" hotkeys (e.g. <kbd>⌘</kbd> on macOS and
 * <kbd>Ctrl</kbd> on Windows/Linux), detect OS in your application and provide
 * different `hotkey` values.
 *
 * `ctrl` means the Control key on all platforms.
 * 2. All browsers and operating systems have some built-in hotkeys
 * that may conflict with your defined hotkeys.
 * For example, `cmd+p` is often used to print the current page.
 * Make sure to choose hotkeys that do not conflict with common browser hotkeys,
 * and user's expected behavior.
 * :::
 */
@Component({
    tag: 'limel-example-menu-hotkeys',
    shadow: true,
})
export class MenuHotkeysExample {
    @State()
    private lastSelectedItem: string;

    private items: Array<ListSeparator | MenuItem> = [
        { text: 'Edit message', commandText: 'Is ignored', hotkey: 'e' },
        { text: 'Mark unread', hotkey: 'u', disabled: true },
        {
            text: 'Remind me',
            items: [
                { text: 'Later today' },
                { text: 'Tomorrow' },
                { text: 'Next week' },
            ],
        },
        { separator: true },
        { text: 'Copy link', hotkey: 'l' },
        { text: 'Copy message', hotkey: 'meta+c' },
        { separator: true },
        {
            text: 'Organize',
            hotkey: 'o',
            items: [
                { text: 'Move to', hotkey: 'm' },
                { text: 'Label as', hotkey: 'shift+l' },
                { text: 'Mute', hotkey: 'alt+m' },
            ],
        },
        {
            text: 'Connect to apps',
            items: [{ text: 'Trello' }, { text: 'Asana' }],
        },
        { separator: true },
        { text: 'Delete message…', hotkey: 'delete' },
    ];

    public render() {
        return (
            <Host>
                <limel-menu items={this.items} onSelect={this.handleSelect}>
                    <limel-icon-button
                        label="Menu"
                        icon="menu_2"
                        elevated={true}
                        slot="trigger"
                    />
                </limel-menu>
                <limel-example-value
                    label="Last selected item"
                    value={this.lastSelectedItem}
                />
            </Host>
        );
    }

    private handleSelect = (event: LimelMenuCustomEvent<MenuItem>) => {
        this.lastSelectedItem = event.detail.text;
    };
}
