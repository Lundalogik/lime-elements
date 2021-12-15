import { ListItem } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

/**
 * List with a primary component
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
                },
            },
        },
    ];

    public render() {
        return <limel-list items={this.items} class="has-striped-rows" />;
    }
}
