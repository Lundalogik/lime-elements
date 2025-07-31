import { ListItem, MenuItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * List item with action menu
 *
 * This example shows how a list item can have an action menu
 * with multiple actions that can be triggered by the user.
 *
 * ⚠️ _TODO: verify that this implementation is correct_ 👇
 * The consumer (e.g. `limel-list`) component should handle the interaction with the action menu.
 * - Action menu items are `MenuItem` objects where `value` contains the actual `Action`
 * - **Event bubbling:** `limel-menu` emits `select` events with the `MenuItem` as `event.detail`
 * - **Natural forwarding:** The select event bubbles up and `limel-list` re-emits it
 * - **Value extraction:** the final consumer of `limel-list`
 * will eventually extract `event.detail.value` to get the actual `Action`
 */
@Component({
    tag: 'limel-example-list-item-actions',
    shadow: true,
    styleUrl: 'list-item-basic.scss',
})
export class ListItemActionsExample {
    @State()
    private lastInteraction: string = '';

    @State()
    private selectedItems: Set<number> = new Set();

    private actionItems: Array<MenuItem | ListSeparator> = [
        { text: 'Edit item', value: 'edit', icon: 'edit' },
        { text: 'Duplicate item', value: 'duplicate', icon: 'copy' },
        { text: 'Share item', value: 'share', icon: 'share' },
        { separator: true },
        {
            text: 'Delete item',
            value: 'delete',
            icon: 'trash',
            disabled: false,
        },
    ];

    public render() {
        return (
            <Host>
                <ul>
                    <limel-list-item
                        value={1}
                        selectable={true}
                        selected={this.selectedItems.has(1)}
                        text="King of Tokyo"
                        secondaryText="A fun dice game for 2-6 players"
                        icon="gorilla"
                        actions={this.actionItems}
                        onInteract={this.onListItemInteraction}
                    />
                    <limel-list-item
                        value={2}
                        selectable={true}
                        selected={this.selectedItems.has(2)}
                        text="Pandemic"
                        secondaryText="Cooperative board game where players work together to save the world"
                        icon="virus"
                        actions={this.actionItems}
                        onInteract={this.onListItemInteraction}
                    />
                </ul>
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
}
