import { Icon } from '../../global/shared-types/icon.types';
import { MenuItem } from '../menu/menu.types';

/**
 * Renders the button in the action bar without their labels.
 * Does not affect the items that are overflown into the overflow menu.
 * @public
 */
export type ActionBarItem<T = any> =
    | ActionBarItemOnlyIcon<T>
    | ActionBarItemWithLabel<T>;

/**
 * Action bar item that only displays an icon.
 * @public
 */
export interface ActionBarItemOnlyIcon<T> extends MenuItem<T> {
    iconOnly: true;
    icon: string | Icon;
}

/**
 * Action bar item that displays an icon and a label.
 * @public
 */
export interface ActionBarItemWithLabel<T> extends MenuItem<T> {
    iconOnly?: false;
}
