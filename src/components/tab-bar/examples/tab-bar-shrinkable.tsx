import { Component, h, State } from '@stencil/core';
import { Tab } from '@limetech/lime-elements';
/**
 * With shrinkable tabs
 * Bla bla…
 */
@Component({
    tag: 'limel-example-tab-bar-shrinkable',
    shadow: true,
})
export class TabBarExample {
    @State()
    private text: string = 'Joker';

    @State()
    private tabs: Tab[] = [
        {
            id: 1,
            text: 'Joker',
            icon: 'joker',
            active: true,
            iconColor: 'var(--lime-green)',
        },
        {
            id: 2,
            text: 'Parasite',
            icon: 'insect',
            iconColor: 'var(--lime-magenta)',
            badge: 999,
        },
        {
            id: 3,
            text: 'Harriet',
            icon: 'administrator_female',
            iconColor: 'var(--lime-orange)',
            badge: 99940,
        },
        {
            id: 4,
            text: 'Bombshell',
            icon: 'surprised',
            iconColor: 'var(--lime-blue)',
        },
        {
            id: 5,
            text: 'Judy',
            icon: 'female',
            iconColor: 'var(--lime-deep-red)',
            badge: 1,
        },
        {
            id: 6,
            text: 'Friends',
            icon: 'friends',
            iconColor: 'var(--lime-yellow)',
            badge: 1290000,
        },
        {
            id: 7,
            text: 'Little Women',
            icon: 'female',
            iconColor: 'var(--lime-deep-red)',
            badge: 4,
        },
    ];

    public render() {
        return [
            <limel-tab-bar
                tabs={this.tabs}
                onChangeTab={this.handleChange}
                class="has-shrinkable-tabs"
            />,
            <limel-example-value label="Tab" value={this.text} />,
        ];
    }

    private handleChange = (event: CustomEvent<Tab>) => {
        this.text = event.detail.text;
        this.tabs = this.tabs.map((tab) => {
            if (tab.id === event.detail.id) {
                return event.detail;
            }

            return tab;
        });
    };
}
