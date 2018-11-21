export interface ListItem {
    /**
     * Text to display in the list item
     */
    text: string;

    /**
     * Additional supporting text to display in the list item
     */
    secondaryText?: string;

    /**
     * True if the list item should be disabled
     */
    disabled?: boolean;

    /**
     * Name of the icon to use.
     */
    icon?: string;

    /**
     * Background color of the icon. Overrides `--icon-background-color`
     */
    iconColor?: string;

    /**
     * True if a checkbox of this item should be checked
     */
    checked?: boolean;

    [data: string]: any;
}

export interface ListSeparator {
    separator: true;
}
