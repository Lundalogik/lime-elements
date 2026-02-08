import { Component, h, Host, State } from '@stencil/core';
import type { LimelHotkeyTriggerDetail } from '@limetech/lime-elements';

/**
 * The `disabled` prop.
 * When set to `true`, the hotkey is still rendered but will not emit events.
 */
@Component({
    tag: 'limel-example-hotkey-disabled',
    shadow: true,
    styleUrl: 'hotkey-basic.scss',
})
export class HotkeyDisabledExample {
    @State()
    private lastSelectedHotkey: string;

    public render() {
        return (
            <Host onHotkeyTrigger={this.handleHotkeyTrigger}>
                <limel-hotkey value="a" disabled={true} />
                <limel-hotkey value="b" />
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
