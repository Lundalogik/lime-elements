import { ListItem } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

@Component({
    tag: 'my-custom-menu',
    shadow: { delegatesFocus: true },
})
export class MyCustomMenu {
    private items: Array<ListItem<number>> = [
        {
            text: 'Companies',
            icon: {
                name: 'organization',
                color: 'rgb(var(--color-blue-default)',
            },
        },
        {
            text: 'Deals',
            icon: {
                name: 'money',
                color: 'rgb(var(--color-green-default))',
            },
        },
        {
            text: 'Agreements',
            icon: {
                name: 'handshake',
                color: 'rgb(var(--color-pink-default))',
            },
        },
        {
            text: 'Todos',
            icon: {
                name: 'today',
                color: 'rgb(var(--color-teal-default))',
            },
        },
        {
            text: 'History',
            icon: {
                name: 'comments',
                color: 'rgb(var(--color-grey-light))',
            },
        },
        {
            text: 'Coworkers',
            icon: {
                name: 'gender_neutral_user',
                color: 'rgb(var(--color-orange-light))',
            },
        },
        {
            text: 'Persons',
            icon: {
                name: 'user_group_man_man',
                color: 'rgb(var(--color-yellow-dark)',
            },
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
