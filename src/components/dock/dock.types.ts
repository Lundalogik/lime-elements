import { IconName } from '../../global/shared-types/icon.types';

/**
 * @public
 */
export interface DockItem {
    /**
     * A non-changing value to uniquely identify each item.
     */
    id: string;

    /**
     * Text to display for the item.
     */
    label: string;

    /**
     * Name of the icon to use.
     */
    icon: IconName;

    /**
     * Additional helper text for the dock item.
     * Example usage can be a keyboard shortcut to activate the dock item.
     */
    helperLabel?: string;

    /* eslint-disable no-irregular-whitespace */
    /**
     * Whether the dock item should indicate it is selected.
     * These dock items normally take the user to a top-level location within
     * the navigation tree; for example "Home", "Search" or "My Account".
     * Set `selected` to `true`, when:
     * - the user interface is showing the same top-level location as the dock
     * item is pointing at, or
     * - the user interface is showing a page which is a sub-location of the
     * top-level location. For example, when user is at
     * _My Account ➡ Notification Settings_, the dock item of _My Account_
     * should have the `selected` state.
     */
    selected?: boolean;
    /* eslint-enable no-irregular-whitespace */

    /**
     * Used to specify a custom component to render as a menu for the dock item.
     */
    dockMenu?: DockMenu;

    /**
     * If specified, will display a notification badge on the buttons in the dock.
     */
    badge?: number | string;
}

/**
 * @public
 */
export interface DockMenu {
    /**
     * The tag name of a custom component to be displayed in a popover when
     * clicking on the dock item this menu belongs to.
     */
    componentName: string;

    /**
     * Whether the menu is open.
     */
    menuOpen?: boolean;

    /**
     * Any properties that should be set on the custom component.
     */
    props?: {
        [key: string]: any;
    };
}
