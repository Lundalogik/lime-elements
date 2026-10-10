import { Component, h, Host, State } from '@stencil/core';
import { Tab } from '@limetech/lime-elements';

/**
 * Setting the width of the tabs
 * Each orientation has a CSS property of its own for the width of its tabs.
 *
 * - In a horizontal tab bar, a tab is as wide as its content, up to `16rem`.
 *   `--tab-bar-horizontal-tab-max-width` changes that limit.
 * - A vertical tab bar is `10rem` wide, whatever its labels, so that it keeps
 *   its size when a label or a badge changes. `--tab-bar-vertical-width`
 *   changes that width.
 *
 * In both, a label that does not fit is cut off, while the icon and the badge
 * keep their full size. A `limel-tab-panel` passes both properties on to its
 * tab bar, so they can be set on the panel too.
 *
 * @sourceFile tab-bar-tab-width.scss
 */
@Component({
    tag: 'limel-example-tab-bar-tab-width',
    shadow: true,
    styleUrl: 'tab-bar-tab-width.scss',
})
export class TabBarTabWidthExample {
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
        },
        {
            id: 3,
            text: 'Everything Everywhere All at Once',
            icon: {
                name: 'galaxy',
                color: 'var(--lime-blue)',
            },
            badge: 7,
        },
        {
            id: 4,
            text: 'The Grand Budapest Hotel',
            badge: 'NEW',
        },
    ];

    public render() {
        return (
            <Host>
                <limel-tab-bar
                    tabs={this.tabs}
                    onChangeTab={this.handleChange}
                />
                <limel-tab-bar
                    orientation="vertical"
                    tabs={this.tabs}
                    onChangeTab={this.handleChange}
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
}
