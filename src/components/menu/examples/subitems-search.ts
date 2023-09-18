import { MenuItem, ListSeparator } from '@limetech/lime-elements';

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
        (i) => !i.separator && i.text?.toLowerCase().includes(searchValue)
    );
}

function flattenMenuItems(menuItems: MenuItem[]): MenuItem[] {
    const flattenedItems: MenuItem[] = [];

    function flatten(menuItem: MenuItem) {
        flattenedItems.push(menuItem);

        if (menuItem.subItems) {
            for (const subItem of menuItem.subItems) {
                flatten(subItem);
            }
        }
    }

    for (const menuItem of menuItems) {
        flatten(menuItem);
    }

    return flattenedItems;
}
