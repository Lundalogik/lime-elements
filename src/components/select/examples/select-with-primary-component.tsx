import { Option } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Select with a primary component
 *
 * Just like list items, options in `limel-select` can render a custom
 * primary component using the `primaryComponent` prop. The primary
 * component is rendered both in the dropdown list and in the trigger
 * area, next to the selected value.
 *
 * :::note
 * 1. The primary component does not become automatically disabled,
 * once an option is disabled. Clicks on, or interactions with the
 * component will still be registered on disabled options.
 * You should handle the disabled state of the components accordingly.
 * 2. Dropdowns with primary component in their items won't render as platform-native
 * dropdown on mobile devices.
 * :::
 * :::tip
 * Primary components can carry their own host-level styles, or use
 * `style` properties to fit the design of the select, or position
 * themselves within it. In the example, the badge uses custom CSS
 * properties to adjust its colors, and an `order` style on its host
 * to appear on the right side of the selected option instead of the
 * left, next to the dropdown arrow.
 * :::
 */
@Component({
    shadow: true,
    tag: 'limel-example-select-with-primary-component',
})
export class SelectExample {
    @State()
    public value: Option;

    private readonly options: Option[] = [
        {
            text: 'King of Tokyo',
            secondaryText: '2 players',
            value: 'tokyo',
            primaryComponent: {
                name: 'limel-circular-progress',
                props: {
                    value: 5,
                    maxValue: 10,
                    suffix: '%',
                    displayPercentageColors: true,
                    size: 'small',
                },
            },
        },
        {
            text: 'Smash Up!',
            secondaryText: '2-5 players',
            value: 'smash',
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
            value: 'pandemic',
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
            value: 'ticket',
            primaryComponent: {
                name: 'limel-badge',
                props: {
                    label: 'Completed',
                    style: {
                        order: 3,
                        '--badge-max-width': 'auto',
                        '--badge-text-color': 'rgb(var(--color-white))',
                        '--badge-background-color':
                            'rgb(var(--color-green-default))',
                    },
                },
            },
        },
    ];

    public render() {
        return (
            <section>
                <limel-select
                    label="Game night pick"
                    helperText="The number indicates how often we have played the game"
                    value={this.value}
                    options={this.options}
                    onChange={this.handleChange}
                />
                <limel-example-value value={this.value} />
            </section>
        );
    }

    private readonly handleChange = (event) => {
        this.value = event.detail;
    };
}
