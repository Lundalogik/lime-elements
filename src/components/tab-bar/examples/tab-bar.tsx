import { Component, h, State } from '@stencil/core';
import { Tab } from '../tab.types';

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
            icon: 'joker',
            active: true,
            iconColor: 'var(--lime-green)',
        },
        {
            id: 2,
            text: 'Parasite',
            icon: 'insect',
            iconColor: 'var(--lime-magenta)',
        },
        {
            id: 3,
            text: 'Harriet',
            icon: 'administrator_female',
            iconColor: 'var(--lime-orange)',
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
        },
        {
            id: 6,
            text: 'Jojo Rabbit',
            icon: 'rabbit',
            iconColor: 'var(--lime-yellow)',
        },
        {
            id: 7,
            text: 'Little Women',
            icon: 'female',
            iconColor: 'var(--lime-deep-red)',
        },
    ];

    constructor() {
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return [
            <limel-tab-bar tabs={this.tabs} onChangeTab={this.onChange} />,
            <p>Tab: {this.text}</p>,
        ];
    }

    private onChange(event: CustomEvent<Tab>) {
        this.text = event.detail.text;
        this.tabs = this.tabs.map(tab => {
            if (tab.id === event.detail.id) {
                return event.detail;
            }
            return tab;
        });
    }
}
