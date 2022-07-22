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
    icon: string;

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
     * Used to specify a custom component to render as the dock button.
     */
    dockButton?: DockButton;

    /**
     * Used to specify a custom component to render as a menu for the button.
     */
    dockMenu?: DockMenu;
}

export interface DockButton {
    /**
     * Must be the tag name of a custom component implementing the
     * [CustomDockButton](#/type/CustomDockButton/) interface.
     */
    componentName: string;

    /**
     * Any properties that should be set on the custom component.
     */
    props?: {
        [key: string]: any;
    };
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
}

export interface CustomDockButton {
    /**
     * The dock item to render.
     */
    item: DockItem;

    /**
     * Tells the individual item whether or not the dock is expanded.
     */
    expanded?: boolean;

    /**
     * Tells the individual items whether the dock has a horizontal or vertical
     * layout. When `true`, the dock is horizontal, and placed at the bottom of
     * the viewport. Otherwise, the dock is vertical, and placed on the left
     * edge of the viewport (for RTL languages).
     */
    useMobileLayout?: boolean;
}
