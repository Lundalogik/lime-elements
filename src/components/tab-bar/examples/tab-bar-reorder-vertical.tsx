import { Component, h, Host, State } from '@stencil/core';
import { Tab, TabReorderEvent } from '@limetech/lime-elements';

/**
 * Let the user reorder the tabs of a vertical bar
 * The drag handles of a vertical tab bar move the tabs up and down, instead of
 * left and right.
 *
 * @sourceFile tab-bar-reorder-vertical.scss
 */
@Component({
    tag: 'limel-example-tab-bar-reorder-vertical',
    shadow: true,
    styleUrl: 'tab-bar-reorder-vertical.scss',
})
export class TabBarReorderVerticalExample {
    @State()
    private tabs: Tab[] = [
        {
            id: 1,
            text: 'Joker',
            icon: {
                name: 'joker',
                color: 'var(--lime-green)',
            },
            active: true,
        },
        {
            id: 2,
            text: 'Parasite',
            icon: {
                name: 'insect',
                color: 'var(--lime-magenta)',
            },
            badge: 999,
        },
        {
            id: 3,
            text: 'Harriet',
            icon: {
                name: 'administrator_female',
                color: 'var(--lime-orange)',
            },
        },
        {
            id: 4,
            text: 'Judy',
            icon: {
                name: 'female',
                color: 'var(--lime-deep-red)',
            },
            badge: 940_000,
        },
        {
            id: 5,
            text: 'Friends',
            icon: {
                name: 'friends',
                color: 'var(--lime-yellow)',
            },
        },
    ];

    public render() {
        return (
            <Host>
                <limel-tab-bar
                    allowTabReorder={true}
                    orientation="vertical"
                    tabs={this.tabs}
                    onChangeTab={this.handleChange}
                    onReorderTab={this.handleReorder}
                />
                <limel-example-value
                    label="Order"
                    value={this.tabs.map(({ text }) => text).join(', ')}
                />
            </Host>
        );
    }

    private handleChange = (event: CustomEvent<Tab>) => {
        this.tabs = this.tabs.map((tab) => {
            if (tab.id === event.detail.id) {
                return event.detail;
            }

            return tab;
        });
    };

    private handleReorder = (event: CustomEvent<TabReorderEvent>) => {
        const { fromIndex, toIndex } = event.detail;
        const tabs = [...this.tabs];
        tabs.splice(toIndex, 0, ...tabs.splice(fromIndex, 1));
        this.tabs = tabs;
    };
}
