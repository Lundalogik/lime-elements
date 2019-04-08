import { Component } from '@stencil/core';
import { ListItem } from '../../interface';

@Component({
    tag: 'limel-example-list-secondary',
    shadow: true,
})
export class SecondaryTextListExample {
    private items: Array<ListItem<number>> = [
        { text: 'King of Tokyo', secondaryText: '2-6 players', value: 1 },
        { text: 'Smash Up!', secondaryText: '2-4 players', value: 2 },
        { text: 'Pandemic', secondaryText: '2-4 players', value: 3 },
        { text: 'Catan', secondaryText: '3-4 players', value: 4 },
        { text: 'Ticket to Ride', secondaryText: '2-5 players', value: 5 },
    ];

    public render() {
        return <limel-list items={this.items} />;
    }
}
