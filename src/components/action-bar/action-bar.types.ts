import { MenuItem } from '../../interface';

/**
 * Renders the button in the action bar without their labels.
 * Does not affect the items that are overflown into the overflow menu.
 */
export type ActionBarItem = ActionBarItemOnlyIcon | ActionBarItemWithLabel;

interface ActionBarItemOnlyIcon extends MenuItem {
    iconOnly: true;
    icon: string;
}

interface ActionBarItemWithLabel extends MenuItem {
    iconOnly?: false;
}
