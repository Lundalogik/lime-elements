import { ListItem } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

@Component({
    tag: 'my-custom-menu',
    shadow: true,
})
export class MyCustomMenu {
    private items: Array<ListItem<number>> = [
        {
            text: 'King of Tokyo',
            value: 1,
            icon: 'gorilla',
        },
        {
            text: 'Smash Up!',
            value: 2,
            icon: 'alien',
            iconColor: 'rgb(var(--color-lime-light))',
        },
        {
            text: 'Pandemic',
            value: 3,
            icon: 'virus',
            iconColor: 'rgb(var(--color-red-light))',
        },
        {
            text: 'Catan',
            value: 4,
            icon: 'wheat',
            iconColor: 'rgb(var(--color-amber-default))',
        },
        {
            text: 'Todo',
            value: 5,
            icon: 'steam_engine',
            iconColor: 'rgb(var(--color-glaucous-default))',
        },
    ];

    public render() {
        return (
            <limel-list
                items={this.items}
                badgeIcons={true}
                class="has-grid-layout has-interactive-items"
            />
        );
    }
}
