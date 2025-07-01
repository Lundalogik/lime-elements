import { Component, h, State } from '@stencil/core';
import { Tab } from '@limetech/lime-elements';

@Component({
    tag: 'limel-example-tab-bar',
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
            badge: 99_940,
        },
        {
            id: 4,
            text: 'Bombshell',
            icon: {
                name: 'surprised',
                color: 'var(--lime-blue)',
            },
            badge: 999_990,
        },
        {
            id: 5,
            text: 'Judy',
            icon: {
                name: 'female',
                color: 'var(--lime-deep-red)',
            },
            badge: 940_000,
        },
        {
            id: 6,
            text: 'Friends',
            icon: {
                name: 'friends',
                color: 'var(--lime-yellow)',
            },
            badge: 1_290_000,
        },
        {
            id: 7,
            text: 'Little Women',
            icon: {
                name: 'female',
                color: 'var(--lime-deep-red)',
            },
            badge: 4,
        },
        {
            id: 8,
            text: 'Inception',
            badge: 'NEW',
        },
    ];

    public render() {
        return [
            <limel-tab-bar tabs={this.tabs} onChangeTab={this.handleChange} />,
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
