import { Component } from '@stencil/core';
import { ListItem } from '../../components/list/list-item';

@Component({
    tag: 'limel-example-list-secondary',
    shadow: true,
})
export class SecondaryTextListExample {
    private items: ListItem[] = [
        { text: 'King of Tokyo', secondaryText: '2-6 players', id: 1 },
        { text: 'Smash Up!', secondaryText: '2-4 players', id: 2 },
        { text: 'Pandemic', secondaryText: '2-4 players', id: 3 },
        { text: 'Catan', secondaryText: '3-4 players', id: 4 },
        { text: 'Ticket to Ride', secondaryText: '2-5 players', id: 5 },
    ];

    public render() {
        return <limel-list items={this.items} />;
    }
}
