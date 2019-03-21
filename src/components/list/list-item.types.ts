export interface ListItem<T = any> {
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
     * Value of the list item
     */
    value?: T;
}

export interface ListSeparator {
    separator: true;
}
