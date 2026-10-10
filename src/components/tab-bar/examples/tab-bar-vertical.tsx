import { Component, h, Host, State } from '@stencil/core';
import { Tab } from '@limetech/lime-elements';

/**
 * Vertical tab bar
 * Set `orientation` to `vertical` to stack the tabs in a column. The selected
 * tab then merges into the content to its right, instead of into the content
 * below it.
 *
 * Give the tab bar a height. When the tabs do not fit in it, the tab bar
 * scrolls, the same way that a horizontal one does.
 *
 * A vertical tab bar is `10rem` wide, whatever its labels, so that it keeps
 * its size when a label or a badge changes. Set `--tab-bar-vertical-width` to
 * change it. A label that does not fit is cut off, while the icon and the
 * badge keep their full size.
 *
 * The up and down arrow keys move between the tabs of a vertical tab bar,
 * instead of the left and right ones.
 *
 * @sourceFile tab-bar-vertical.scss
 */
@Component({
    tag: 'limel-example-tab-bar-vertical',
    shadow: true,
    styleUrl: 'tab-bar-vertical.scss',
})
export class TabBarVerticalExample {
    @State()
    private text: string = 'Joker';

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
            badge: 99_940,
        },
        {
            id: 4,
            text: 'Everything Everywhere All at Once',
            icon: {
                name: 'galaxy',
                color: 'var(--lime-blue)',
            },
        },
        {
            id: 5,
            text: 'Judy',
            icon: {
                name: 'female',
                color: 'var(--lime-deep-red)',
            },
            badge: 940_000,
        },
        {
            id: 6,
            text: 'Friends',
            icon: {
                name: 'friends',
                color: 'var(--lime-yellow)',
            },
        },
        {
            id: 7,
            text: 'Little Women',
            icon: {
                name: 'female',
                color: 'var(--lime-deep-red)',
            },
            badge: 4,
        },
        {
            id: 8,
            text: 'Inception',
            badge: 'NEW',
        },
    ];

    public render() {
        return (
            <Host>
                <limel-tab-bar
                    orientation="vertical"
                    tabs={this.tabs}
                    onChangeTab={this.handleChange}
                />
                <limel-example-value label="Tab" value={this.text} />
            </Host>
        );
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
