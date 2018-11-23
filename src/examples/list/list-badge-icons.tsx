import { Component } from '@stencil/core';
import { ListItem } from '../../interface';

@Component({
    tag: 'limel-example-list-badge-icons',
    shadow: true,
    styleUrl: 'list-badge-icons.scss',
})
export class BadgeIconsListExample {
    private items: ListItem[] = [
        {
            text: 'King of Tokyo',
            secondaryText: '2-6 players',
            id: 1,
            icon: 'gorilla',
        },
        {
            text: 'Smash Up!',
            secondaryText: '2-4 players',
            id: 2,
            icon: 'alien',
            iconColor: '#66bb6a',
        },
        {
            text: 'Pandemic',
            secondaryText: '2-4 players',
            id: 3,
            icon: 'virus',
            iconColor: '#ff7043',
        },
        {
            text: 'Catan',
            secondaryText: '3-4 players',
            id: 4,
            icon: 'wheat',
            iconColor: '#ffb03b',
        },
        {
            text: 'Ticket to Ride',
            secondaryText: '2-5 players',
            id: 5,
            icon: 'steam_engine',
            iconColor: '#57879f',
        },
    ];

    public render() {
        return [
            <limel-list items={this.items} badgeIcons={true} />,
            <hr />,
            <p>
                When importing ListItem, see{' '}
                <a href="/usage#import-statements">Usage</a>
            </p>,
        ];
    }
}
