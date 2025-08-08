import { Component, h } from '@stencil/core';

/**
 * With icons
 */
@Component({
    tag: 'limel-example-list-item-icon',
    shadow: true,
    styleUrl: 'list-item-basic.scss',
})
export class ListItemIconExample {
    public render() {
        return (
            <ul>
                <limel-list-item
                    value={1}
                    tabindex="0"
                    text="Santa Hat"
                    secondaryText="Santa's favorite"
                    icon={{
                        name: 'santas_hat',
                        title: 'Icon of Santa Hat',
                        color: 'rgb(var(--color-coral-default))',
                    }}
                />
                <limel-list-item
                    value={2}
                    tabindex="0"
                    text="Party Hat"
                    secondaryText="For the party animals"
                    icon={{
                        name: 'party_hat',
                        title: 'Icon of Party Hat',
                        color: 'rgb(var(--color-white))',
                        backgroundColor: 'rgb(var(--color-pink-default))',
                    }}
                />
            </ul>
        );
    }
}
