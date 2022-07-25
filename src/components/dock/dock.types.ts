export interface DockItem<T = any> {
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
    icon: string;

    /**
     * Value of the Dock item.
     */
    value?: T;

    /**
     * Additional helper text for the button.
     * Example usage can be a keyboard shortcut to activate the button.
     */
    helperLabel?: string;

    /**
     * Whether the button should indicate it is selected.
     * The button should be selected when … (@Kiarokh: add description here please!)
     */
    selected?: boolean;

    /**
     * Used to specify a custom component to render as a menu for the button.
     */
    dockMenu?: DockMenu;
}

export interface DockMenu {
    /**
     * The tag name of a custom component to be displayed in a popover when
     * clicking on the dock item this belongs to.
     */
    componentName: string;

    /**
     * Any properties that should be set on the custom component.
     */
    props?: {
        [key: string]: any;
    };

    /**
     * Whether the menu is open or not.
     */
    menuOpen?: boolean;
}
