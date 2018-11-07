import { Component } from '@stencil/core';
import { ListItem } from '../../interface';

@Component({
    tag: 'limel-example-list-icons',
    shadow: true,
})
export class IconsListExample {
    private items: ListItem[] = [
        { text: 'King of Tokyo', id: 1, icon: 'animals/gorilla' },
        { text: 'Smash Up!', id: 2, icon: 'cinema/alien' },
        { text: 'Pandemic', id: 3, icon: 'Healthcare/virus' },
        { text: 'Catan', id: 4, icon: 'plants/wheat' },
        { text: 'Ticket to Ride', id: 5, icon: 'transport/steam_engine' },
    ];

    public render() {
        return [
            <limel-list items={this.items} />,
            <hr />,
            <p>
                When importing ListItem, see{' '}
                <a href="/usage#import-statements">Usage</a>
            </p>,
        ];
    }
}
