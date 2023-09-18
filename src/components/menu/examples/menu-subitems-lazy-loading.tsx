import {
    MenuItem,
    ListSeparator,
    LimelMenuCustomEvent,
} from '@limetech/lime-elements';
import { Component, State, h } from '@stencil/core';

const NETWORK_DELAY = 1000;
/**
 * Lazy loading infinite amount of sub menu items.
 */
@Component({
    tag: 'limel-example-menu-subitems-lazy-loading',
    shadow: true,
})
export class MenuSubItemsLazyLoadingExample {
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
