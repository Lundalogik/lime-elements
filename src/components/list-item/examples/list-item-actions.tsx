import { MenuItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * List item with action menu
 *
 * This example shows how a list item can have an action menu
 * with multiple actions that can be triggered by the user.
 *
 * The consumer (e.g. `limel-list`) component should handle the interaction with the action menu.
 * - Action menu items are `MenuItem` objects where `value` contains the actual `Action`
 * - **Event bubbling:** `limel-menu` emits `select` events with the `MenuItem` as `event.detail`
 * - **Natural forwarding:** The select event bubbles up and `limel-list` re-emits it
 * - **Value extraction:** the final consumer of `limel-list`
 * will eventually extract `event.detail.value` to get the actual `Action`
 *
 * :::note
 * Disabled list items keep their action menu enabled so actions remain
 * accessible (e.g., for contextual info). The example guards against
 * toggling selection when disabled.
 * :::
 */
@Component({
    tag: 'limel-example-list-item-actions',
    shadow: true,
    styleUrl: 'list-item-basic.scss',
})
export class ListItemActionsExample {
    @State()
    private disabled = false;

    @State()
    private lastInteraction: string = '';

    @State()
    private selectedItems: Set<number> = new Set();

    private actionItems: Array<MenuItem | ListSeparator> = [
        { text: 'Edit', value: 'edit', icon: 'edit' },
        { text: 'Duplicate', value: 'duplicate', icon: 'copy' },
        { text: 'Share', value: 'share', icon: 'share' },
        { separator: true },
        { text: 'Delete', value: 'delete', icon: 'trash', disabled: true },
    ];

    public render() {
        return (
            <Host>
                <ul onClick={this.onClick} onKeyDown={this.onKeyDown}>
                    <limel-list-item
                        tabIndex={0}
                        data-value={1}
                        value={1}
                        type="option"
                        selected={this.selectedItems.has(1)}
                        text="King of Tokyo"
                        secondaryText="A fun dice game for 2-6 players"
                        icon="gorilla"
                        actions={this.actionItems}
                        disabled={this.disabled}
                    />
                    <limel-list-item
                        tabIndex={0}
                        data-value={2}
                        value={2}
                        type="option"
                        selected={this.selectedItems.has(2)}
                        text="Pandemic"
                        secondaryText="Cooperative board game where players work together to save the world"
                        icon="virus"
                        actions={this.actionItems}
                        disabled={this.disabled}
                    />
                </ul>
                <limel-example-controls>
                    <limel-switch
                        label="Disabled"
                        value={this.disabled}
                        onChange={this.setDisabled}
                    />
                </limel-example-controls>
                <limel-example-value
                    label="Last interaction"
                    value={this.lastInteraction}
                />
            </Host>
        );
    }

    private toggleValue = (value: number, text: string) => {
        const selected = this.selectedItems.has(value);
        if (selected) {
            this.selectedItems = new Set(
                [...this.selectedItems].filter((id) => id !== value)
            );
            this.lastInteraction = `Deselected "${text}"`;
        } else {
            this.selectedItems = new Set([...this.selectedItems, value]);
            this.lastInteraction = `Selected "${text}"`;
        }
    };

    private onClick = (event: MouseEvent) => {
        // If the entire example is disabled, ignore item clicks
        if (this.disabled) {
            return;
        }
        const host = (event.target as HTMLElement).closest('limel-list-item');
        if (!host) {
            return;
        }
        // Skip if clicking the action menu trigger or inside the menu
        if (
            (event.target as HTMLElement).closest('.action-menu-trigger') ||
            (event.target as HTMLElement).closest('limel-menu')
        ) {
            return;
        }
        // Respect per-item disabled state (attribute reflected by the component)
        if (
            host.hasAttribute('disabled') ||
            host.getAttribute('aria-disabled') === 'true'
        ) {
            return;
        }
        const value = Number((host as HTMLElement).dataset.value);
        const text = host.getAttribute('text') || '';
        this.toggleValue(value, text);
    };

    private onKeyDown = (event: KeyboardEvent) => {
        if (this.disabled) {
            return;
        }
        const isEnter = event.key === 'Enter';
        const isSpace =
            event.key === ' ' ||
            event.key === 'Space' ||
            event.key === 'Spacebar' ||
            event.code === 'Space';
        if (!isEnter && !isSpace) {
            return;
        }
        if (event.repeat) {
            return;
        }
        if (isSpace) {
            event.preventDefault();
        }
        const focused = (event.target as HTMLElement).closest(
            'limel-list-item'
        );
        if (!focused) {
            return;
        }
        if (
            (event.target as HTMLElement).closest('.action-menu-trigger') ||
            (event.target as HTMLElement).closest('limel-menu') ||
            focused.hasAttribute('disabled') ||
            focused.getAttribute('aria-disabled') === 'true'
        ) {
            return;
        }
        const value = Number((focused as HTMLElement).dataset.value);
        const text = focused.getAttribute('text') || '';
        this.toggleValue(value, text);
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        this.disabled = event.detail;
    };
}
