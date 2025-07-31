import { ListItem } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

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

    public render() {
        return (
            <Host>
                <div role="radiogroup" aria-labelledby="package-size-heading">
                    {this.items.map((item) => (
                        <limel-list-item
                            key={item.value}
                            value={item.value}
                            text={item.text}
                            secondaryText={item.secondaryText}
                            type="radio"
                            selectable={true}
                            selected={this.selectedValue === item.value}
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

        // For radio buttons, always select the clicked item (even if it was already selected)
        this.selectedValue = itemValue;

        this.lastInteraction = `Selected "${event.detail.item.text}"`;
    };
}
