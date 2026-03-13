import { Component, h, Host } from '@stencil/core';

/**
 * The `disabled` prop
 *
 * When set to `true`, the hotkey is rendered in a visually disabled state.
 * This is useful when the action associated with the hotkey is temporarily
 * unavailable (e.g. a disabled menu item).
 */
@Component({
    tag: 'limel-example-hotkey-disabled',
    shadow: true,
    styleUrl: 'hotkey-basic.scss',
})
export class HotkeyDisabledExample {
    public render() {
        return (
            <Host>
                <limel-hotkey value="a" disabled={true} />
                <limel-hotkey value="b" />
            </Host>
        );
    }
}
