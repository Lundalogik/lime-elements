import {
    MenuItem,
    ListSeparator,
    LimelMenuCustomEvent,
} from '@limetech/lime-elements';
import { Component, State, h } from '@stencil/core';

const NETWORK_DELAY = 1000;

/**
 * Lazy loading infinite amount of sub-menu
 *
 * :::note
 * This example is here to show what the component looks like when you have a
 * lot of nested sub-menus, and what the breadcrumb component looks like when
 * you are deep into the menu.
 *
 * If you are looking for code examples, please see the
 * _Lazy loading items in sub-menus_ example instead.
 * :::
 */
@Component({
    tag: 'limel-example-menu-sub-menu-lazy-loading-infinite',
    shadow: true,
})
export class MenuSubMenuLazyLoadingInfiniteExample {
    private items: Array<MenuItem | ListSeparator> = [];

    @State()
    private lastSelectedItem: string;

    public componentWillLoad() {
        this.items = [
            {
                text: 'Item 1',
                items: this.handleLoadSubItems,
            },
            {
                text: 'Item 2',
                items: this.handleLoadSubItems,
            },
            {
                text: 'Item 3',
                items: this.handleLoadSubItems,
            },
            {
                text: 'Item 4',
                items: this.handleLoadSubItems,
            },
            {
                text: 'Item 5',
                items: this.handleLoadSubItems,
            },
        ];
    }

    public render() {
        return [
            <limel-menu items={this.items} onSelect={this.handleSelect}>
                <limel-button label="Menu" slot="trigger" />
            </limel-menu>,
            <limel-example-value
                label="Last selected item"
                value={this.lastSelectedItem}
            />,
        ];
    }

    private handleLoadSubItems = async (
        item: MenuItem
    ): Promise<MenuItem[]> => {
        return new Promise<MenuItem[]>((resolve) => {
            // Simulate some network delay
            setTimeout(() => {
                const subItems = [];
                for (let i = 1; i < 6; i++) {
                    subItems.push({
                        text: `${item.text}.${i}`,
                        items: this.handleLoadSubItems,
                    });
                }

                resolve(subItems);
            }, NETWORK_DELAY);
        });
    };

    private handleSelect = (event: LimelMenuCustomEvent<MenuItem>) => {
        this.lastSelectedItem = event.detail.text;
    };
}
