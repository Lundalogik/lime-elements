import { Component, h, State } from '@stencil/core';
import { Tab } from '@limetech/lime-elements';

/**
 * This example illustrates how to add custom components inside the `limel-tab-panel`.
 *
 * Each component will simulate loading the data it needs once the tab has been
 * activated and then display the actual content. If the button is pressed, the
 * component will emit the `changeTab` event to change the badge inside the
 * corresponding tab.
 * @link tab-panel-content.tsx
 * @link tab-panel-content.scss
 */
@Component({
    tag: 'limel-example-tab-panel',
    shadow: true,
    styleUrl: 'tab-panel.scss',
})
export class TabPanelExample {
    @State()
    private tabs: Tab[] = [
        {
            id: 'joker',
            text: 'Joker',
            icon: 'joker',
            active: true,
            iconColor: 'var(--lime-green)',
        },
        {
            id: 'parasite',
            text: 'Parasite',
            icon: 'insect',
            iconColor: 'var(--lime-magenta)',
        },
        {
            id: 'harriet',
            text: 'Harriet',
            icon: 'administrator_female',
            iconColor: 'var(--lime-orange)',
        },
    ];

    public render() {
        return [
            <limel-tab-panel
                tabs={this.tabs}
                onChangeTab={this.handleChangeTab}
            >
                <limel-example-tab-panel-content id="joker" />
                <limel-example-tab-panel-content id="parasite" />
                <limel-example-tab-panel-content id="harriet" />
            </limel-tab-panel>,
        ];
    }

    private handleChangeTab = (event: CustomEvent<Tab>) => {
        this.tabs = this.tabs.map((tab) => {
            if (tab.id === event.detail.id) {
                return event.detail;
            }

            return tab;
        });
    };
}
