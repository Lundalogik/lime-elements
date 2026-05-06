import { LimelMenuCustomEvent, MenuItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * With a primary component
 *
 * Menu items can render a custom primary component using the
 * `primaryComponent` prop, just like list items.
 *
 * The component is rendered before the item's text.
 */
@Component({
    tag: 'limel-example-menu-primary-component',
    shadow: true,
})
export class MenuPrimaryComponentExample {
    @State()
    private lastSelectedItem: string;

    private items: MenuItem[] = [
        {
            text: 'Upload file',
            secondaryText: 'Completed',
            primaryComponent: {
                name: 'limel-circular-progress',
                props: {
                    value: 10,
                    maxValue: 10,
                    suffix: '%',
                    displayPercentageColors: true,
                    size: 'small',
                },
            },
        },
        {
            text: 'Sync contacts',
            secondaryText: 'In progress…',
            primaryComponent: {
                name: 'limel-circular-progress',
                props: {
                    value: 4,
                    maxValue: 10,
                    suffix: '%',
                    displayPercentageColors: true,
                    size: 'small',
                },
            },
        },
        {
            text: 'Generate report',
            secondaryText: 'Just started',
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
    ];

    public render() {
        return [
            <limel-menu items={this.items} onSelect={this.handleSelect}>
                <limel-button label="Tasks" slot="trigger" />
            </limel-menu>,
            <limel-example-value value={this.lastSelectedItem} />,
        ];
    }

    private handleSelect = (event: LimelMenuCustomEvent<MenuItem>) => {
        this.lastSelectedItem = event.detail.text;
    };
}
