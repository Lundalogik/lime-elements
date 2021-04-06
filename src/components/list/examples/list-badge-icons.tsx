import { ListItem } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

/**
 * List with badge icons
 */
@Component({
    tag: 'limel-example-list-badge-icons',
    shadow: true,
    styleUrl: 'list-badge-icons.scss',
})
export class BadgeIconsListExample {
    private items: Array<ListItem<number>> = [
        {
            text: 'King of Tokyo',
            secondaryText: '2-6 players',
            value: 1,
            icon: 'gorilla',
        },
        {
            text: 'Smash Up!',
            secondaryText: '2-4 players',
            value: 2,
            icon: 'alien',
            iconColor: 'rgb(var(--color-lime-light))',
        },
        {
            text: 'Pandemic',
            secondaryText: '2-4 players',
            value: 3,
            icon: 'virus',
            iconColor: 'rgb(var(--color-red-light))',
        },
        {
            text: 'Catan',
            secondaryText: '3-4 players',
            value: 4,
            icon: 'wheat',
            iconColor: 'rgb(var(--color-amber-default))',
        },
        {
            text: 'Ticket to Ride',
            secondaryText: '2-5 players',
            value: 5,
            icon: 'steam_engine',
            iconColor: 'rgb(var(--color-glaucous-default))',
        },
    ];

    public render() {
        return <limel-list items={this.items} badgeIcons={true} />;
    }
}
