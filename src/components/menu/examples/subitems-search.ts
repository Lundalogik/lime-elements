import { MenuItem, ListSeparator } from '@limetech/lime-elements';

/**
 *
 * @param searchValue
 * @param menuItems
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

    return flattenedItems.filter(
        (i) =>
            !('separator' in i) && i.text?.toLowerCase().includes(searchValue)
    );
}

function flattenMenuItems(
    menuItems: Array<MenuItem | ListSeparator>
): MenuItem[] {
    const flattenedItems: MenuItem[] = [];

    function flatten(menuItem: MenuItem) {
        flattenedItems.push(menuItem);

        if (Array.isArray(menuItem.items)) {
            for (const subItem of menuItem.items) {
                if (!('separator' in subItem)) {
                    flatten(subItem as MenuItem);
                }
            }
        }
    }

    for (const menuItem of menuItems) {
        if (!('separator' in menuItem)) {
            flatten(menuItem as MenuItem);
        }
    }

    return flattenedItems;
}
