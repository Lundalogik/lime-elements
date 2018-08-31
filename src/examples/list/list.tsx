import { Component } from '@stencil/core';
import { ListItem, ListSeparator } from '../../components/list/list-item';

@Component({
    tag: 'limel-example-list',
    shadow: true,
})
export class ListExample {
    private items: Array<ListItem | ListSeparator> = [
        { text: 'King of Tokyo', id: 1 },
        { text: 'Smash Up!', id: 2 },
        { text: 'Pandemic', id: 3 },
        { separator: true },
        { text: 'Catan', id: 4 },
        { text: 'Ticket to Ride', id: 5 },
    ];

    public render() {
        return <limel-list items={this.items} />;
    }
}
