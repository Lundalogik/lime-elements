import {
    MenuItem,
    ListSeparator,
    LimelMenuCustomEvent,
} from '@limetech/lime-elements';
import { Component, State, h } from '@stencil/core';
import { SearchMenuItems } from './subitems-search';
import { SearchableMenuItems } from './nested-item-constants';

/**
 * Searchable items
 *
 * Unlike some other components like `limel-picker` or `limel-select` that
 * have internal fallback search (filtering) logic, this component has no built-in
 * “default local filter”.
 *
 * This example showcases a purely consumer-side pattern, demonstrating how to
 * implement and attach a searcher to the component.
 *
 * ### What the searcher must return
 * - An array of `MenuItem` | `ListSeparator`.
 * - These items are rendered flat (no automatic parent–child reconstruction).
 *
 * :::tip
 * It is great to show the end user the hierarchical breadcrumbs for search results.
 * A keyword might be found in several sub-menus, and that can make it confusing
 * for the user to see the exact same keyword listed several times in the search results.
 * Therefore—as we did in this example—by populating `secondaryText` or other fields,
 * you can visualize the context of the found item.
 *
 * To give it a try, test searching for "Phone", in this example.
 *
 * **How the searcher works:**
 * See `subitems-search.ts`
 * - For each search match (in `SearchMenuItems`), we build an ancestor chain
 * using the internally cloned `parentItem` links.
 * - We generate `secondaryText` only if the item didn’t already define one.
 * - Formatting rules:
 *   - 0 ancestors: no `secondaryText`.
 *   - 1 ancestor: `Parent`
 *   - 2 ancestors: `Grandparent` › `Parent`
 *   - 3+ ancestors: … › `SecondToLast` › `Parent`
 * - We have used a › character to be consistent with `limel-breadcrumb`'s default design.
 * - For the ellipsis, we have used the typographic … (single character) to
 *  indicate truncation.
 * :::
 *
 * @sourceFile nested-item-constants.ts
 * @sourceFile subitems-search.ts
 */
@Component({
    tag: 'limel-example-menu-searchable',
    shadow: true,
})
export class MenuSubItemsExample {
    private items: Array<MenuItem | ListSeparator> = SearchableMenuItems;

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
                <limel-chip
                    text="Filter"
                    icon={{
                        name: 'plus_math',
                        color: 'rgb(var(--contrast-800))',
                        title: 'Add',
                    }}
                    slot="trigger"
                />
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
