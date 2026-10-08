import { Component, h, Host, State } from '@stencil/core';
import { Tab } from '@limetech/lime-elements';

/**
 * Vertical tab panel
 * Set `orientation` to `vertical` to place the tabs in a column, to the left
 * of the content. This suits a view with many sections, such as settings, in
 * a container that is wider than it is tall.
 *
 * The column is `10rem` wide, whatever its labels, so that the content next
 * to it keeps its place when a label or a badge changes. Try the vote button:
 * the badge it adds takes room from the label, not from the content. Set
 * `--tab-bar-vertical-width` on the panel to change the width.
 *
 * @sourceFile tab-panel-content.tsx
 * @sourceFile tab-panel-content.scss
 */
@Component({
    tag: 'limel-example-tab-panel-vertical',
    shadow: true,
    styleUrl: 'tab-panel-basic.scss',
})
export class TabPanelVerticalExample {
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
        return (
            <Host>
                <limel-tab-panel
                    orientation="vertical"
                    tabs={this.tabs}
                    onChangeTab={this.handleChangeTab}
                >
                    <limel-example-tab-panel-content id="joker" />
                    <limel-example-tab-panel-content id="parasite" />
                    <limel-example-tab-panel-content id="harriet" />
                </limel-tab-panel>
            </Host>
        );
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
