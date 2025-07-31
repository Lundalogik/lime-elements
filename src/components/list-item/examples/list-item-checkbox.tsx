import { ListItem } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

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
                <div role="group" aria-labelledby="notification-heading">
                    {this.items.map((item) => (
                        <limel-list-item
                            key={item.value}
                            value={item.value}
                            text={item.text}
                            secondaryText={item.secondaryText}
                            type="checkbox"
                            selectable={true}
                            selected={this.selectedValues.has(item.value)}
                            onInteract={this.onListItemInteraction}
                        />
                    ))}
                </div>
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
}
