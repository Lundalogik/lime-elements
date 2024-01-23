import { Icon, MenuItem } from '../../interface';

/**
 * Renders the button in the action bar without their labels.
 * Does not affect the items that are overflown into the overflow menu.
 */
export type ActionBarItem<T = any> =
    | ActionBarItemOnlyIcon<T>
    | ActionBarItemWithLabel<T>;

interface ActionBarItemOnlyIcon<T> extends MenuItem<T> {
    iconOnly: true;
    icon: string | Icon;
}

interface ActionBarItemWithLabel<T> extends MenuItem<T> {
    iconOnly?: false;
}
