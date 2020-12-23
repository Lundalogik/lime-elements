export interface Chip<T = any> {
    /**
     * ID of the chip. Must be unique.
     */
    id: number | string;

    /**
     * Text to display inside the chip.
     */
    text: string;

    /**
     * Name of the icon to use. Not valid for `filter`.
     */
    icon?: string;

    /**
     * @deprecated
     * Use `iconBackgroundColor` to set the background color of the icon.
     */
    iconColor?: string;

    /**
     * Color of the icon. Overrides `--icon-color`.
     */
    iconFillColor?: string;

    /**
     * Background color of the icon. Overrides `--icon-background-color`.
     */
    iconBackgroundColor?: string;

    /**
     * Whether the chip should be removable. Not valid for `choice`.
     */
    removable?: boolean;

    /**
     * Whether the chip is selected. Only valid for `choice` and `filter`.
     */
    selected?: boolean;

    /**
     * Value of the chip.
     */
    value?: T;
}
