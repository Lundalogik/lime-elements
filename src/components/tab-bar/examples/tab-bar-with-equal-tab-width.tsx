import { Component, h, State } from '@stencil/core';
import { Tab } from '@limetech/lime-elements';

/**
 * Tab bars with custom styles
 * In some situations and for the sake of UI design, you may want to have tabs
 * that equally share the available screen width and stretch. To get such a
 * result, you can add the `has-tabs-with-equal-width` class to the tab bar.
 */
@Component({
    tag: 'limel-example-tab-bar-with-equal-tab-width',
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
            <limel-tab-bar
                tabs={this.tabs}
                onChangeTab={this.handleChange}
                class="has-tabs-with-equal-width"
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
