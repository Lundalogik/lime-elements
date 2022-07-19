import { ListItem } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

@Component({
    tag: 'my-custom-menu',
    shadow: true,
})
export class MyCustomMenu {
    private items: Array<ListItem<number>> = [
        {
            text: 'Companies',
            icon: 'organization',
            iconColor: 'rgb(var(--color-blue-default)',
        },
        {
            text: 'Deals',
            icon: 'money',
            iconColor: 'rgb(var(--color-green-default))',
        },
        {
            text: 'Agreements',
            icon: 'handshake',
            iconColor: 'rgb(var(--color-pink-default))',
        },
        {
            text: 'Todos',
            icon: 'today',
            iconColor: 'rgb(var(--color-teal-default))',
        },
        {
            text: 'History',
            icon: 'comments',
            iconColor: 'rgb(var(--color-grey-light))',
        },
        {
            text: 'Coworkers',
            icon: 'gender_neutral_user',
            iconColor: 'rgb(var(--color-orange-light))',
        },
        {
            text: 'Persons',
            icon: 'user_group_man_man',
            iconColor: 'rgb(var(--color-yellow-dark)',
        },
    ];

    public render() {
        return [
            <limel-header
                heading="Navigate to a table"
                subheading="Showing 7 of 12"
                supportingText="Show all…"
            />,
            <limel-list
                items={this.items}
                class="has-grid-layout has-interactive-items"
            />,
        ];
    }
}
