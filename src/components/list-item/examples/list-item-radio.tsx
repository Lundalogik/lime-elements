import { ListItem } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

const NOTIFICATION_ICON = {
    name: 'notification_alert',
    title: 'Notification alert icon',
    color: 'rgb(var(--color-yellow-default))',
    backgroundColor: 'rgb(var(--color-pink-default))',
};

/**
 * Radio button list items
 *
 * This example shows how list items can be displayed as radio buttons.
 * Radio buttons allow users to select only one option from a group.
 *
 * :::important
 * - The consumer component should set `role="radiogroup"` for the `ul` or
 * the container of the `limel-list-item`s
 * :::
 *
 * :::note
 * The radio buttons are purely visual - the selection logic
 * is handled by the parent component through the interact events.
 * :::
 */
@Component({
    tag: 'limel-example-list-item-radio',
    shadow: true,
    styleUrl: 'list-item-basic.scss',
})
export class ListItemRadioExample {
    @State()
    private selectedValue: number | null = 1; // Pre-select first item

    @State()
    private lastInteraction: string = '';

    private items = [
        { value: 1, text: 'Small (S)', secondaryText: 'Up to 10 items' },
        { value: 2, text: 'Medium (M)', secondaryText: 'Up to 50 items' },
        { value: 3, text: 'Large (L)', secondaryText: 'Up to 100 items' },
        { value: 4, text: 'Extra Large (XL)', secondaryText: 'Over 100 items' },
    ];

    @State()
    private icon?: {
        name: string;
        title: string;
        color: string;
        backgroundColor: string;
    } = NOTIFICATION_ICON;

    @State()
    private badgeIcon = true;

    public render() {
        return (
            <Host>
                <ul role="radiogroup" aria-label="Package size">
                    {this.items.map((item) => (
                        <limel-list-item
                            key={item.value}
                            value={item.value}
                            text={item.text}
                            secondaryText={item.secondaryText}
                            type="radio"
                            selected={this.selectedValue === item.value}
                            tabindex={
                                this.selectedValue === item.value ? 0 : -1
                            }
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

        // For radio buttons, always select the clicked item (even if it was already selected)
        this.selectedValue = itemValue;

        this.lastInteraction = `Selected "${event.detail.item.text}"`;
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
