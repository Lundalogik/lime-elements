import { ListItem } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

/**
 * List with a primary component
 *
 * List items can render a custom primary component using the
 * `primaryComponent` prop.
 *
 * :::tip
 * By default, the primary component is rendered after the icon
 * and before the item's text.
 *
 * Since the list item is a flexbox, you can easily change the
 * order of the primary component by applying a different `order`
 * via `style`.
 *
 * You can set `order` either via the primary component's own styles,
 * or via its `props`.
 * :::
 *
 * :::note
 * The primary component does not become automatically disabled,
 * once the list item is disabled. Clicks on, or interactions with the component
 * will still be registered on disabled items.
 * You should handle the disabled state of the components accordingly.
 * :::
 */
@Component({
    tag: 'limel-example-list-primary-component',
    shadow: true,
})
export class ListCircularProgressExample {
    private items: Array<ListItem<number>> = [
        {
            text: 'King of Tokyo',
            secondaryText: '2 players',
            value: 1,
            primaryComponent: {
                name: 'limel-circular-progress',
                props: {
                    value: 5,
                    maxValue: 10,
                    suffix: '%',
                    displayPercentageColors: true,
                    size: 'small',
                    style: {
                        order: 3,
                    },
                },
            },
        },
        {
            text: 'Smash Up!',
            secondaryText: '2-5 players',
            value: 2,
            primaryComponent: {
                name: 'limel-circular-progress',
                props: {
                    value: 1,
                    maxValue: 10,
                    suffix: '%',
                    displayPercentageColors: true,
                    size: 'small',
                },
            },
        },
        {
            text: 'Pandemic',
            secondaryText: '2-4 players',
            value: 3,
            primaryComponent: {
                name: 'limel-circular-progress',
                props: {
                    value: 8,
                    maxValue: 10,
                    suffix: '%',
                    displayPercentageColors: true,
                    size: 'small',
                },
            },
        },
        {
            text: 'Ticket to Ride',
            secondaryText: '1-3 players',
            value: 5,
            primaryComponent: {
                name: 'limel-circular-progress',
                props: {
                    value: 3,
                    maxValue: 10,
                    suffix: '%',
                    displayPercentageColors: true,
                    size: 'small',
                },
            },
        },
    ];

    public render() {
        return <limel-list items={this.items} class="has-striped-rows" />;
    }
}
