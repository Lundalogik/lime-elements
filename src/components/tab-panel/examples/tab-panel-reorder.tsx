import { Component, h, Host, State } from '@stencil/core';
import { Tab, TabReorderEvent } from '@limetech/lime-elements';

/**
 * Let the user reorder the tabs
 * Set `allowTabReorder` to give every tab a drag handle, so that the user can
 * drag the tabs into the order they want. The panel does not change `tabs`
 * itself. When the user drops a tab in a new place, the `reorderTab` event
 * tells which tab was moved, and from which position to which. The tab stays
 * where it was, until the component gives the panel the tabs in their new
 * order. That is also the place to save the order, if it should be remembered.
 *
 * The content follows its tab, since each component inside the panel is tied
 * to its tab by its `id`.
 *
 * The tabs can be reordered with a mouse and with a touch screen, where the
 * drag handle is pressed and held for a moment before it is dragged. They
 * cannot be reordered with the keyboard yet.
 *
 * @sourceFile tab-panel-content.tsx
 * @sourceFile tab-panel-content.scss
 */
@Component({
    tag: 'limel-example-tab-panel-reorder',
    shadow: true,
    styleUrl: 'tab-panel-basic.scss',
})
export class TabPanelReorderExample {
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
                    allowTabReorder={true}
                    tabs={this.tabs}
                    onChangeTab={this.handleChangeTab}
                    onReorderTab={this.handleReorderTab}
                >
                    <limel-example-tab-panel-content id="joker" />
                    <limel-example-tab-panel-content id="parasite" />
                    <limel-example-tab-panel-content id="harriet" />
                </limel-tab-panel>
                <limel-example-value
                    label="Order"
                    value={this.tabs.map(({ text }) => text).join(', ')}
                />
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

    private handleReorderTab = (event: CustomEvent<TabReorderEvent>) => {
        const { fromIndex, toIndex } = event.detail;
        const tabs = [...this.tabs];
        tabs.splice(toIndex, 0, ...tabs.splice(fromIndex, 1));
        this.tabs = tabs;
    };
}
