import { ListItem } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

const NOTIFICATION_ICON = {
    name: 'notification_alert',
    title: 'Notification alert icon',
    color: 'rgb(var(--color-yellow-default))',
    backgroundColor: 'rgb(var(--color-pink-default))',
};

/**
 * Checkbox list items
 *
 * This example shows how list items can be displayed as checkboxes.
 * Checkboxes allow users to select multiple options from a group.
 *
 * :::important
 * - The consumer component should set `role="group"` for the `ul` or
 * the container of the `limel-list-item`s
 * :::
 *
 * :::note
 * - The checkboxes are purely visual - the selection logic
 * is handled by the parent component through the interact events.
 * :::
 */
@Component({
    tag: 'limel-example-list-item-checkbox',
    shadow: true,
    styleUrl: 'list-item-basic.scss',
})
export class ListItemCheckboxExample {
    @State()
    private selectedValues: Set<number> = new Set([2]); // Pre-select second item

    @State()
    private lastInteraction: string = '';

    @State()
    private icon?: {
        name: string;
        title: string;
        color: string;
        backgroundColor: string;
    } = NOTIFICATION_ICON;

    @State()
    private badgeIcon = true;

    private items = [
        {
            value: 1,
            text: 'Email notifications',
            secondaryText: 'Receive updates via email',
        },
        {
            value: 2,
            text: 'Push notifications',
            secondaryText: 'Receive updates on your device',
        },
        {
            value: 3,
            text: 'SMS notifications',
            secondaryText: 'Receive updates via text message',
        },
        {
            value: 4,
            text: 'Newsletter',
            secondaryText: 'Weekly product updates and tips',
        },
    ];

    public render() {
        return (
            <Host>
                <ul role="group" aria-label="Notification preferences">
                    {this.items.map((item) => (
                        <limel-list-item
                            key={item.value}
                            value={item.value}
                            text={item.text}
                            secondaryText={item.secondaryText}
                            type="checkbox"
                            selected={this.selectedValues.has(item.value)}
                            onInteract={this.onListItemInteraction}
                            icon={this.icon}
                            badgeIcon={this.badgeIcon}
                        />
                    ))}
                </ul>
                <limel-example-value
                    label="Last interaction"
                    value={this.lastInteraction}
                />
                <limel-example-controls>
                    <limel-checkbox
                        checked={!!this.icon}
                        label="icon"
                        onChange={this.setIcon}
                    />
                    <limel-checkbox
                        checked={this.badgeIcon}
                        label="badgeIcon"
                        onChange={this.setBadgeIcon}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private onListItemInteraction = (
        event: CustomEvent<{ selected: boolean; item: ListItem }>
    ) => {
        const itemValue = event.detail.item.value as number;
        const isSelected = event.detail.selected;

        // For checkboxes, toggle the selection state
        if (isSelected) {
            this.selectedValues = new Set([...this.selectedValues, itemValue]);
        } else {
            this.selectedValues = new Set(
                [...this.selectedValues].filter((id) => id !== itemValue)
            );
        }

        this.lastInteraction = `${isSelected ? 'Selected' : 'Deselected'} "${event.detail.item.text}"`;
    };

    private setBadgeIcon = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.badgeIcon = event.detail;
    };

    private setIcon = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.icon = event.detail ? NOTIFICATION_ICON : undefined;
    };
}
