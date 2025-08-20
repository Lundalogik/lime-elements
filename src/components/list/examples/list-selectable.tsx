import {
    LimelListCustomEvent,
    ListItem,
    ListSeparator,
} from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * List with selectable items
 * By default, a items of a list show a simpl visual feedback when hovered.
 * Once they are clicked, they emits an event with details about the item.
 *
 * However, certain list `type`s are "selectable";
 * for instance `selectable`, `radio` and `checkbox`.
 * When users click items in a list with these types (or focus and press Enter/Space)
 * the list should toggle the selection state of the items.
 *
 * A `selected` item both visually indicates that it is selected,
 * and also informs assistive technology about its state.
 *
 * Each of these "selectable" types visualize the selected state differently.
 *
 * - `selectable`: The selected state is indicated by a tinted background,
 * colored by the consumer's defined accent color.
 * - `radio`: The selected state is indicated by a filled circle.
 * - `checkbox`: The selected state is indicated by a checked checkmark.
 *
 * Needless to say that a `disabled` item cannot be selected or interacted with.
 */
@Component({
    tag: 'limel-example-list-selectable',
    shadow: true,
})
export class SelectableListExample {
    @State()
    private items: Array<ListItem<number> | ListSeparator> = [
        { text: 'King of Tokyo', value: 1 },
        { text: 'Smash Up!', value: 2 },
        { text: 'Pandemic', value: 3, selected: true },
        { separator: true },
        { text: 'Catan', value: 4, disabled: true },
        { text: 'Ticket to Ride', value: 5 },
    ];

    @State()
    private lastEvent: string = 'No events yet';

    public render() {
        return (
            <Host>
                <limel-list
                    onChange={this.handleChange}
                    type="selectable"
                    items={this.items}
                />
                <limel-example-value
                    label="Last event"
                    value={this.lastEvent}
                />
            </Host>
        );
    }

    private handleChange = (event: LimelListCustomEvent<ListItem>) => {
        const isSelected = event.detail.selected === true;
        this.lastEvent = `${event.detail.text} (selected: ${isSelected ? 'true' : 'false'})`;

        this.items = this.items.map((item: ListItem) => {
            if (item.value === event.detail.value) {
                return event.detail;
            }

            return item;
        });
    };
}
