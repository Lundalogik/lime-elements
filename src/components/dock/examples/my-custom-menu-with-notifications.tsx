import { ListItem } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

@Component({
    tag: 'my-custom-menu-with-notifications',
    shadow: { delegatesFocus: true },
    styleUrl: 'my-custom-menu-with-notifications.scss',
})
export class MyCustomMenuWithNotifications {
    private items: Array<ListItem<number>> = [
        {
            text: 'Preferences',
            icon: {
                name: 'horizontal_settings_mixer',
                color: 'rgb(var(--color-blue-default)',
            },
            primaryComponent: {
                name: 'limel-badge',
                props: {
                    label: 2,
                    style: {
                        order: '2',
                    },
                },
            },
        },
        {
            text: "What's new",
            icon: {
                name: 'new',
                color: 'rgb(var(--color-orange-default)',
            },
            primaryComponent: {
                name: 'limel-badge',
                props: {
                    label: 3,
                    style: {
                        order: '2',
                    },
                },
            },
        },
        {
            text: 'Sign out',
            icon: {
                name: 'shutdown',
                color: 'rgb(var(--color-red-default))',
            },
        },
    ];

    public render() {
        return [
            <limel-header heading="Hi user!" icon="user_male_circle" />,
            <limel-list
                items={this.items}
                class="has-grid-layout has-interactive-items"
            />,
        ];
    }
}
