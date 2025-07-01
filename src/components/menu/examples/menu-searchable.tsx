import {
    MenuItem,
    ListSeparator,
    LimelMenuCustomEvent,
} from '@limetech/lime-elements';
import { Component, State, h } from '@stencil/core';
import { SearchMenuItems } from './subitems-search';
import { CascadingMenuItems } from './item-constants';

/**
 * Searchable items
 *
 * @sourceFile subitems-search.ts
 * @sourceFile item-constants.ts
 */
@Component({
    tag: 'limel-example-menu-searchable',
    shadow: true,
})
export class MenuSubItemsExample {
    private items: Array<MenuItem | ListSeparator> = [
        {
            separator: true,
            text: 'Example items',
        },
        ...CascadingMenuItems,
        {
            text: 'Long sub list',
            items: Array.from(Array.from({ length: 50 }), (_value, index) => {
                return {
                    text: `Item ${index + 1}`,
                };
            }),
        },
    ];

    @State()
    private lastSelectedItem: MenuItem;

    public render() {
        return [
            <limel-menu
                items={this.items}
                searcher={this.handleSearch}
                onSelect={this.handleSelect}
                emptyResultMessage="No items found"
            >
                <limel-button label="Menu" slot="trigger" />
            </limel-menu>,
            <limel-example-value
                label="Last selected item"
                value={this.lastSelectedItem?.text ?? ''}
            />,
        ];
    }

    private handleSearch = async (queryString: string) => {
        return SearchMenuItems(queryString, this.items);
    };

    private handleSelect = (event: LimelMenuCustomEvent<MenuItem>) => {
        this.lastSelectedItem = event.detail;
    };
}
