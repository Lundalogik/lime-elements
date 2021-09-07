export interface DockItem<T = any> {
    /**
     * By default, all items in the Dock are rendered as buttons.
     * When user clicks on them, they will run an specified action.
     * However, for some use cases you can open a more complex
     * component such as a list of items in a popover, when the
     * dock item is clicked.
     */
    component?: {
        name: string;
        props?: T;
    };

    /**
     * Text to display in the list item.
     */
    isFooterStart?: boolean;

    /**
     * Text to display in the list item.
     */
    label?: string;

    /**
     * xxxx
     */
    helperLabel?: string;

    /**
     * True if the list item should be selected.
     */
    selected?: boolean;

    /**
     * Background color of selected button.
     */
    selectedColor?: string;

    /**
     * Value of the list item.
     */
    value?: T;

    /**
     * Name of the icon to use.
     */
    icon?: string;

    /**
     * Fill color of the icon on the button,
     * when it is neither selected nor passed.
     */
    iconColor?: string;
}
