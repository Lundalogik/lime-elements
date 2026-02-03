import { Component, h, Host, State } from '@stencil/core';
import type { LimelHotkeyTriggerDetail } from '@limetech/lime-elements';

/**
 * Duplicate hotkeys
 *
 * If multiple enabled `<limel-hotkey>` instances are configured with the same
 * hotkey (after normalization), only the first handler will run for each
 * keypress. This prevents multiple actions from being triggered by a single
 * keyboard event.
 *
 * When a duplicate is detected at runtime, the first handler will log a
 * `console.warn` (once per keypress) to help you spot and fix the conflict.
 *
 * :::note
 * Disabled instances are not counted and never emit events.
 * :::
 *
 * - Press `2`.
 * - Only one `hotkeyTrigger` will fire (the first handler wins).
 * - A `console.warn` is logged to help you find the duplicate.
 *
 * This behavior is intentional: triggering multiple actions from a single
 * keypress is usually surprising and can be unsafe.
 */
@Component({
    tag: 'limel-example-hotkey-duplicates',
    shadow: true,
    styleUrl: 'hotkey-basic.scss',
})
export class HotkeyDuplicatesExample {
    @State()
    private lastSelectedHotkey: string;

    public render() {
        return (
            <Host onHotkeyTrigger={this.handleHotkeyTrigger}>
                <limel-hotkey value="2" />
                <limel-hotkey value="2" />
                <limel-hotkey value="z" />
                <limel-hotkey value="z" disabled={true} />
                <limel-example-value
                    label="Last selected item"
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
