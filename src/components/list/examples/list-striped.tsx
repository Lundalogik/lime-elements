import { ListItem } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-list-striped',
    shadow: true,
})
export class StripedListExample {
    private items: Array<ListItem<number>> = [
        {
            text: 'King of Tokyo',
            secondaryText: '2-6 players',
            value: 1,
            disabled: true,
        },
        { text: 'Smash Up!', secondaryText: '2-4 players', value: 2 },
        { text: 'Pandemic', secondaryText: '2-4 players', value: 3 },
        { text: 'Catan', secondaryText: '3-4 players', value: 4 },
        { text: 'Ticket to Ride', secondaryText: '2-5 players', value: 5 },
    ];

    public render() {
        return (
            <limel-list
                items={this.items}
                class="has-striped-rows has-interactive-items"
            />
        );
    }
}
