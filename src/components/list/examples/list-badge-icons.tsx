import { ListItem } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * List with badge icons
 * When `badgeIcons` is set to `true`, the icon's visual motif will be
 * rendered slightly smaller, to provide more space for a colorful background.
 * So when using a `backgroundColor` on the icon, it could be a good idea to
 * also set the `badgeIcons` property to `true`.
 */
@Component({
    tag: 'limel-example-list-badge-icons',
    shadow: true,
    styleUrl: 'list-badge-icons.scss',
})
export class BadgeIconsListExample {
    @State()
    private badgeIcons = true;

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
            icon: {
                name: 'alien',
                color: 'rgb(var(--color-lime-light))',
            },
        },
        {
            text: 'Pandemic',
            secondaryText: '2-4 players',
            value: 3,
            icon: {
                name: 'virus',
                color: 'rgb(var(--color-red-light))',
            },
        },
        {
            text: 'Catan',
            secondaryText: '3-4 players',
            value: 4,
            icon: {
                name: 'wheat',
                color: 'rgb(var(--color-amber-default))',
                backgroundColor: 'rgb(var(--color-cyan-default))',
            },
        },
        {
            text: 'Ticket to Ride',
            secondaryText: '2-5 players',
            value: 5,
            icon: {
                name: 'steam_engine',
                color: 'rgb(var(--color-pink-lighter))',
            },
        },
    ];

    public render() {
        return (
            <Host>
                <limel-list items={this.items} badgeIcons={this.badgeIcons} />
                <limel-example-controls>
                    <limel-switch
                        value={this.badgeIcons}
                        label="badgeIcons"
                        onChange={this.setBadgeIcons}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private setBadgeIcons = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.badgeIcons = event.detail;
    };
}
