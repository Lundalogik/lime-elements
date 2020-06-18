export interface Button {
    /**
     * ID of the button. Must be unique.
     */
    id: string;

    /**
     * Text or label title in the button.
     */
    title: string;

    /**
     * Name of the icon to use
     */
    icon?: string;

    /**
     * True if the button should be selected. only first button will be selected.
     */
    selected?: boolean;
}
