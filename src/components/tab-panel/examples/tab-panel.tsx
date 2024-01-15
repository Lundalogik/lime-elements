import { Component, h, State } from '@stencil/core';
import { Tab } from '@limetech/lime-elements';

/**
 * This example illustrates how to add custom components inside the `limel-tab-panel`.
 *
 * Each component will simulate loading the data it needs once the tab has been
 * activated and then display the actual content. If the button is pressed, the
 * component will emit the `changeTab` event to change the badge inside the
 * corresponding tab.
 *
 * @sourceFile tab-panel-content.tsx
 * @sourceFile tab-panel-content.scss
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
            icon: {
                name: 'joker',
                color: 'var(--lime-green)',
            },
            active: true,
        },
        {
            id: 'parasite',
            text: 'Parasite',
            icon: {
                name: 'insect',
                color: 'var(--lime-magenta)',
            },
        },
        {
            id: 'harriet',
            text: 'Harriet',
            icon: {
                name: 'administrator_female',
                color: 'var(--lime-orange)',
            },
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
