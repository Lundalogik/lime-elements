import { Component } from '@stencil/core';
import { ListItem } from '../../interface';

@Component({
    tag: 'limel-example-list-icons',
    shadow: true,
})
export class IconsListExample {
    private items: ListItem[] = [
        { text: 'King of Tokyo', id: 1, icon: 'gorilla' },
        { text: 'Smash Up!', id: 2, icon: 'alien' },
        { text: 'Pandemic', id: 3, icon: 'virus' },
        { text: 'Catan', id: 4, icon: 'wheat' },
        { text: 'Ticket to Ride', id: 5, icon: 'steam_engine' },
    ];

    public render() {
        return <limel-list items={this.items} />;
    }
}
