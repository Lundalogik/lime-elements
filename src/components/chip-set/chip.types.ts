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
     * Color of the icon. Overrides `--icon-color`.
     */
    iconFillColor?: string;

    /**
     * `title` attribute of the icon
     */
    iconTitle?: string;

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

    /**
     * The value of the badge. Only valid for `filter`.
     */
    badge?: number;

    /**
     * If supplied, the chip will render a link, using the supplied href.
     */
    href?: string;

    /**
     * Whether the chip should be displayed as inaccessible. This is useful for
     * when the user doesn't have read access to the object represented by the
     * chip, but still may have read and/or write access to other objects in the
     * chip-set. Note that `inaccessible` does _not_ imply that the chip is not
     * `removable`. It simply means that the `interact` event will never be
     * emitted for this chip, and the chip will be styled to indicate to the
     * user that it cannot be interacted with (other than removed, _if_
     * `removable` is `true`).
     */
    inaccessible?: boolean;
}
