import { Component, h, State } from '@stencil/core';
import { Tab } from '@limetech/lime-elements';

/**
 * Default UI of Tab bars
 * By default, tabs dynamically adjust their width to their own content, which
 * means a tab with a larger label will be bigger than one with a shorter one.
 * This is the preferred layout for tabs.
 */
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
            icon: {
                name: 'black_cat',
                color: 'var(--lime-dark-grey)',
            },
            active: true,
        },
        {
            id: 2,
            text: 'Dogs',
            icon: {
                name: 'dog',
                color: 'var(--lime-blue)',
            },
        },
        {
            id: 3,
            text: 'Birds',
            icon: {
                name: 'bird',
                color: 'var(--lime-red)',
            },
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
