import { Component, h, Host, State } from '@stencil/core';
import { Tab, TabReorderEvent } from '@limetech/lime-elements';

/**
 * Let the user reorder the tabs
 * Set `allowTabReorder` to give every tab a drag handle, so that the user can
 * drag the tabs into the order they want. The tab bar does not change `tabs`
 * itself. When the user drops a tab in a new place, the `reorderTab` event
 * tells which tab was moved, and from which position to which. The tab stays
 * where it was, until the component gives the tab bar the tabs in their new
 * order. That is also the place to save the order, if it should be remembered.
 *
 * The tabs can be reordered with a mouse and with a touch screen, where the
 * drag handle is pressed and held for a moment before it is dragged. They
 * cannot be reordered with the keyboard yet.
 */
@Component({
    tag: 'limel-example-tab-bar-reorder',
    shadow: true,
})
export class TabBarReorderExample {
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
        },
        {
            id: 4,
            text: 'Judy',
            icon: {
                name: 'female',
                color: 'var(--lime-deep-red)',
            },
            badge: 940_000,
        },
        {
            id: 5,
            text: 'Friends',
            icon: {
                name: 'friends',
                color: 'var(--lime-yellow)',
            },
        },
    ];

    public render() {
        return (
            <Host>
                <limel-tab-bar
                    allowTabReorder={true}
                    tabs={this.tabs}
                    onChangeTab={this.handleChange}
                    onReorderTab={this.handleReorder}
                />
                <limel-example-value
                    label="Order"
                    value={this.tabs.map(({ text }) => text).join(', ')}
                />
            </Host>
        );
    }

    private handleChange = (event: CustomEvent<Tab>) => {
        this.tabs = this.tabs.map((tab) => {
            if (tab.id === event.detail.id) {
                return event.detail;
            }

            return tab;
        });
    };

    private handleReorder = (event: CustomEvent<TabReorderEvent>) => {
        const { fromIndex, toIndex } = event.detail;
        const tabs = [...this.tabs];
        tabs.splice(toIndex, 0, ...tabs.splice(fromIndex, 1));
        this.tabs = tabs;
    };
}
