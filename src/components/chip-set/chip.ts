export interface Chip {
    /**
     * Id of the chip. Needs to be unique
     */
    id: string;

    /**
     * Text to display inside the chip
     */
    text: string | number;

    /**
     * Name of the icon to use. Not valid for `filter`
     */
    icon?: string;

    /**
     * Background color of the icon. Overrides `--icon-background-color`
     */
    iconColor?: string;

    /**
     * Wether the chip should be removable. Not valid for `choice`
     */
    removable?: boolean;

    /**
     * Wether the chip is selected or not. Only valid for `choice` and `filter`
     */
    selected?: boolean;
}
