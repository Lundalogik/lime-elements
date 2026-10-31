import { ListItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

/**
 * Accessible label
 *
 * A list has no visible name of its own. When the list is not introduced by
 * a heading, or the page has more than one list, set `accessibleLabel` to
 * give it a name. A screen reader announces the name when the focus moves
 * into the list, so that the user hears what the list is about.
 */
@Component({
    tag: 'limel-example-list-accessible-label',
    shadow: true,
})
export class ListAccessibleLabelExample {
    private readonly items: Array<ListItem<number> | ListSeparator> = [
        { text: 'King of Tokyo', value: 1 },
        { text: 'Smash Up!', value: 2 },
        { text: 'Pandemic', value: 3 },
        { text: 'Catan', value: 4 },
        { text: 'Ticket to Ride', value: 5 },
    ];

    public render() {
        return <limel-list accessibleLabel="Board games" items={this.items} />;
    }
}
