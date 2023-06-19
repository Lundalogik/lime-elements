import { MenuItem } from '../menu/menu.types';

export interface ActionBarItem extends MenuItem {
    /**
     * Renders the button in the action bar without their labels.
     * Does not affect the items that are overflown into the overflow menu.
     */
    iconOnly?: boolean;
}
