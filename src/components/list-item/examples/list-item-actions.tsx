import { ListItem, MenuItem, ListSeparator } from '@limetech/lime-elements';
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
 * The action menu of the disabled items remains enabled!
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
                <ul>
                    <limel-list-item
                        tabIndex={0}
                        value={1}
                        type="option"
                        selected={this.selectedItems.has(1)}
                        text="King of Tokyo"
                        secondaryText="A fun dice game for 2-6 players"
                        icon="gorilla"
                        actions={this.actionItems}
                        onInteract={this.onListItemInteraction}
                        disabled={this.disabled}
                    />
                    <limel-list-item
                        tabIndex={0}
                        value={2}
                        type="option"
                        selected={this.selectedItems.has(2)}
                        text="Pandemic"
                        secondaryText="Cooperative board game where players work together to save the world"
                        icon="virus"
                        actions={this.actionItems}
                        onInteract={this.onListItemInteraction}
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

    private onListItemInteraction = (
        event: CustomEvent<{ selected: boolean; item: ListItem }>
    ) => {
        const itemValue = event.detail.item.value as number;
        const isSelected = event.detail.selected;

        if (isSelected) {
            this.selectedItems = new Set([...this.selectedItems, itemValue]);
        } else {
            this.selectedItems = new Set(
                [...this.selectedItems].filter((id) => id !== itemValue)
            );
        }

        this.lastInteraction = `Item "${event.detail.item.text}" interaction: selected=${isSelected}`;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        this.disabled = event.detail;
    };
}
