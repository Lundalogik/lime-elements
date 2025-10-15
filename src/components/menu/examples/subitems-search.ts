import { MenuItem, ListSeparator } from '@limetech/lime-elements';

/**
 * Client-side helper used as a `searcher` for `<limel-menu>`.
 *
 * WHAT IT DOES
 * - Performs a case-insensitive substring match against the `text` property of
 *   every (non-separator) menu item in the whole tree.
 * - Flattens the tree so that deep descendants can surface in the search
 *   result list.
 * - Adds hierarchical context for each match by *generating* a `secondaryText`
 *   showing up to the two closest ancestors (truncated with an ellipsis if the
 *   depth is greater):
 *     depth 1: (no secondaryText)
 *     depth 2: `Parent`
 *     depth 3: `Grandparent › Parent`
 *     depth ≥4: `… › ParentLevel2 › Parent`
 * - Never overwrites an existing `secondaryText` defined on an item.
 * - Avoids mutating your original item objects: it creates shallow clones and
 *   attaches an internal `parentItem` reference only to those clones.
 *
 * WHEN TO USE
 * Use this helper if your menu data is already available client-side, and you
 * want a simple, fast search without hitting a server. For remote or paged
 * searches you should implement your own function that returns a Promise of
 * items (still adhering to the same `MenuSearcher` signature).
 *
 * LIMITATIONS / DESIGN CHOICES
 * - Only the `text` field is searched (not `secondaryText`, `commandText`, or
 *   other metadata). Extend the filter logic if you need more fields.
 * - Returned items are *flat*; selecting one acts exactly like selecting a
 *   normal item (no automatic reconstruction of its parent path).
 * - Uses a Unicode ellipsis `…` and a breadcrumb separator `›` for compactness;
 *   change these if your design language differs.
 * - Relies on the internal `parentItem` property (`MenuItem.parentItem`) for
 *   temporary chaining. That property is documented as internal; here it is
 *   only added to the cloned objects this function returns.
 *
 * PERFORMANCE NOTES
 * For very large trees you may want to:
 *  - Debounce calls (the `limel-menu` will call the searcher on each keypress).
 *  - Precompute a cached flattened array shared across invocations.
 *  - Switch to a more advanced search algorithm (e.g., Fuse.js) if fuzzy
 *    matching is required.
 *
 * CUSTOMIZING THE CONTEXT PATH
 * If you prefer another format (e.g., `Parent: Office`, or full root path),
 * adjust the section that builds `visibleAncestors` below. You can also expose
 * a configuration argument if you wrap this helper.
 *
 * EXAMPLE USAGE
 * ```tsx
 * <limel-menu
 *   items={items}
 *   searcher={(query) => Promise.resolve(SearchMenuItems(query, items))}
 * />
 * ```
 *
 * @param searchValue - The raw query string from the `limel-menu` search field.
 * @param menuItems   - The root menu items (can include nested `items`).
 * @returns An array of matching `MenuItem`s enriched with contextual
 *          `secondaryText` where appropriate.
 */
export function SearchMenuItems(
    searchValue: string,
    menuItems: Array<MenuItem | ListSeparator>
): MenuItem[] {
    if (!searchValue) {
        return [];
    }

    searchValue = searchValue?.toLowerCase();
    const flattenedItems = flattenMenuItems(menuItems);

    const results = flattenedItems.filter(
        (i) =>
            !('separator' in i) && i.text?.toLowerCase().includes(searchValue)
    );

    return results.map((item) => {
        // Respect any pre-defined secondaryText
        if (item.secondaryText) {
            return item;
        }

        const ancestors = getAncestorChain(item); // root ... immediate parent (excluding the item itself)
        if (ancestors.length === 0) {
            return item;
        }

        let visibleAncestors: string[];
        if (ancestors.length <= 2) {
            visibleAncestors = ancestors;
        } else {
            // Truncate: show only the last two ancestors with leading ellipsis
            visibleAncestors = ['…', ...ancestors.slice(-2)];
        }

        return {
            ...item,
            secondaryText: visibleAncestors.join(' › '),
        } as MenuItem;
    });
}

function flattenMenuItems(
    menuItems: Array<MenuItem | ListSeparator>,
    parent?: MenuItem
): MenuItem[] {
    const flattenedItems: MenuItem[] = [];

    function flatten(menuItem: MenuItem, parentItem?: MenuItem) {
        const cloned: MenuItem = { ...menuItem };
        if (parentItem) {
            cloned.parentItem = parentItem;
        }
        flattenedItems.push(cloned);

        if (Array.isArray(menuItem.items)) {
            for (const subItem of menuItem.items) {
                if (!('separator' in subItem)) {
                    flatten(subItem as MenuItem, cloned);
                }
            }
        }
    }

    for (const menuItem of menuItems) {
        if (!('separator' in menuItem)) {
            flatten(menuItem as MenuItem, parent);
        }
    }

    return flattenedItems;
}

function getAncestorChain(item: MenuItem): string[] {
    const chain: string[] = [];
    let current = item.parentItem;
    while (current) {
        if (current.text) {
            chain.unshift(current.text);
        }
        current = current.parentItem;
    }
    return chain;
}
