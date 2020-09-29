import { Component, h, State } from '@stencil/core';
import { Tab } from '@limetech/lime-elements';

@Component({
    tag: 'limel-example-tab-bar-with-dynamic-tab-width',
    shadow: true,
})
export class TabBarExample {
    @State()
    private text: string = 'cats';

    @State()
    private tabs: Tab[] = [
        {
            id: 1,
            text: 'Cats',
            icon: 'black_cat',
            active: true,
            iconColor: 'var(--lime-dark-grey)',
        },
        {
            id: 2,
            text: 'Dogs',
            icon: 'dog',
            iconColor: 'var(--lime-blue)',
        },
        {
            id: 3,
            text: 'Birds',
            icon: 'bird',
            iconColor: 'var(--lime-red)',
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
        this.tabs = this.tabs.map((tab) => {
            if (tab.id === event.detail.id) {
                return event.detail;
            }

            return tab;
        });
    }
}
