import {
    MenuItem,
    ListSeparator,
    LimelMenuCustomEvent,
} from '@limetech/lime-elements';
import { Component, State, h } from '@stencil/core';

/**
 * Lazy loading infinite amount of sub menu items.
 */
@Component({
    tag: 'limel-example-menu-subitems-lazy-loading',
    shadow: true,
})
export class MenuSubItemsLazyLoadingExample {
    private items: Array<MenuItem | ListSeparator> = [
        {
            text: 'Item 1',
        },
        {
            text: 'Item 2',
        },
        {
            text: 'Item 3',
        },
        {
            text: 'Item 4',
        },
        {
            text: 'Item 5',
        },
    ];

    @State()
    private lastSelectedItem: string;

    public render() {
        return [
            <limel-menu
                lazyLoadItems
                loadSubItems={this.handleLoadSubItems}
                items={this.items}
                onSelect={this.handleSelect}
            >
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
            setTimeout(() => {
                const subItems = [];
                for (let i = 1; i < 6; i++) {
                    subItems.push({
                        text: `${item.text}.${i}`,
                    });
                }

                resolve(subItems);
            }, 1000);
        });
    };

    private handleSelect = (event: LimelMenuCustomEvent<MenuItem>) => {
        this.lastSelectedItem = event.detail.text;
    };
}
