import { Component, h, State } from '@stencil/core';
import { Tab } from '@limetech/lime-elements';

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

    constructor() {
        this.handleChangeTab = this.handleChangeTab.bind(this);
    }

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

    private handleChangeTab(event: CustomEvent<Tab>) {
        this.tabs = this.tabs.map(tab => {
            if (tab.id === event.detail.id) {
                return event.detail;
            }

            return tab;
        });
    }
}
