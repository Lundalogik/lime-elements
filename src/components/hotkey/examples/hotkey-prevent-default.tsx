import { Component, h, Host, State } from '@stencil/core';
import type { LimelHotkeyTriggerDetail } from '@limetech/lime-elements';

/**
 * Prevent browser defaults
 *
 * By default, matching hotkeys call `event.preventDefault()` to avoid browser
 * shortcuts (for example Save/Print dialogs) firing together with your app
 * action.
 *
 * Use `preventBrowserDefault={false}` when you explicitly want to keep the
 * browser's native behavior.
 *
 * Try this example:
 * - Keep "Prevent browser defaults" enabled and press
 * <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>S</kbd> or <kbd>P</kbd>:
 * browser defaults are prevented.
 * - Disable the switch and press the same hotkeys again:
 * browser defaults are allowed.
 */
@Component({
    tag: 'limel-example-hotkey-prevent-default',
    shadow: true,
    styleUrl: 'hotkey-basic.scss',
})
export class HotkeyPreventDefaultExample {
    @State()
    private lastSelectedHotkey: string;

    @State()
    private preventBrowserDefault = true;

    public render() {
        return (
            <Host onHotkeyTrigger={this.handleHotkeyTrigger}>
                <limel-hotkey
                    value="ctrl+s"
                    preventBrowserDefault={this.preventBrowserDefault}
                />
                <limel-hotkey
                    value="ctrl+p"
                    preventBrowserDefault={this.preventBrowserDefault}
                />
                <limel-hotkey
                    value="cmd+s"
                    preventBrowserDefault={this.preventBrowserDefault}
                />
                <limel-hotkey
                    value="cmd+p"
                    preventBrowserDefault={this.preventBrowserDefault}
                />
                <limel-example-controls style={{ gridColumn: '1 / -1' }}>
                    <limel-switch
                        value={this.preventBrowserDefault}
                        label="Prevent browser defaults"
                        onChange={this.handlePreventDefaultToggle}
                    />
                </limel-example-controls>
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

    private handlePreventDefaultToggle = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.preventBrowserDefault = event.detail;
    };
}
