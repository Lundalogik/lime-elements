export interface Tab {
    /**
     * Id of the tab. Must be unique.
     */
    id: number | string;

    /**
     * Text to display inside the tab.
     */
    text?: string;

    /**
     * Name of the icon to use.
     */
    icon?: string;

    /**
     * True if the tab should be selected.
     */
    active?: boolean;

    /**
     *  Color of the icon.
     */
    iconColor?: string;

    /**
     * Shows a badge within the tab with a specified label
     */
    badge?: number;
}
