import { ListSeparator } from '../../list-item/list-item.types';
import { MenuItem } from '../menu.types';
import { fakeServer } from './menu-sub-menu-lazy-loading-service-mock-server';

/**
 * This example service can be copied and used in your package or solution.
 */
export class LazyLoader {
    private cache: Record<string, Array<MenuItem | ListSeparator>> = {};

    public loadItems = async (
        subMenu: MenuItem
    ): Promise<Array<MenuItem | ListSeparator>> => {
        // First check if the items are already in the cache.
        const cachedItems = this.getFromCache(subMenu);

        if (cachedItems) {
            return cachedItems;
        }

        // If not cached, load them from the server.
        //
        // ::: note
        // If you copy this service, you should replace this with
        // something that actually loads the items from the server.
        // :::
        const items = await fakeServer.loadItems(subMenu);

        // If any of the items have their own sub-menu, and those items
        // are not loaded yet, we add a function for loading them.
        for (const item of items) {
            if ('items' in item && item.items === null) {
                item.items = this.loadItems;
            }
        }

        // Remember to cache the items, so we don't have to load them again later.
        this.setToCache(subMenu, items);

        return items;
    };

    private getFromCache(subMenu: MenuItem): Array<MenuItem | ListSeparator> {
        return this.cache[subMenu.value];
    }

    private setToCache(
        parentItem: MenuItem,
        items: Array<MenuItem | ListSeparator>
    ): void {
        this.cache[parentItem.value] = items;
    }
}
