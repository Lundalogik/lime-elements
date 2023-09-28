import { ListItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

/**
 * Basic list
 */
@Component({
    tag: 'limel-example-list',
    shadow: true,
})
export class ListExample {
    private items: Array<ListItem<number> | ListSeparator> = [
        { text: 'King of Tokyo', value: 1 },
        { text: 'Smash Up!', value: 2 },
        { text: 'Pandemic', value: 3 },
        { text: 'Catan', value: 4 },
        { text: 'Ticket to Ride', value: 5 },
    ];

    public render() {
        return <limel-list items={this.items} />;
    }
}
