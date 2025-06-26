import { Image } from '../../global/shared-types/image.types';
import { Icon } from '../../global/shared-types/icon.types';
import { MenuItem } from '../menu/menu.types';
import { ListSeparator } from '../list/list-item.types';
import { Color } from '../../global/shared-types/color.types';

/**
 * @public
 */
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
    icon?: string | Icon;

    /**
     * A picture to be displayed instead of the icon on the chip.
     */
    image?: Image;

    /**
     * Color of the icon. Overrides `--icon-color`.
     *
     * @deprecated This property is deprecated and will be removed soon!
     *
     * Use the new `Icon` interface instead and write:
     * ```
     * icon {
     *    name: string,
     *    color: string,
     * },
     * ```
     */
    iconFillColor?: Color;

    /**
     * `title` attribute of the icon
     *
     * @deprecated This property is deprecated and will be removed soon!
     *
     * Use the new `Icon` interface instead and write:
     * ```
     * icon {
     *    name: string,
     *    title: string,
     * },
     * ```
     */
    iconTitle?: string;

    /**
     * Background color of the icon. Overrides `--icon-background-color`.
     *
     * @deprecated This property is deprecated and will be removed soon!
     *
     * Use the new `Icon` interface instead and write:
     * ```
     * icon {
     *    name: string,
     *    backgroundColor: string,
     * },
     * ```
     */
    iconBackgroundColor?: Color;

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
     * The value of the badge.
     */
    badge?: number;

    /**
     * If supplied, the chip will render a link, using the supplied href.
     */
    href?: string;

    /**
     * List of the items to display as in a menu, on the chip.
     */
    menuItems?: Array<MenuItem | ListSeparator>;

    /**
     * Set to `true` to put the chip in the `loading` state, and render an
     * indeterminate progress indicator inside the chip.
     */
    loading?: boolean;
}

/**
 * This type is used to determine the visual style and behavior of a Chip component.
 *
 * @beta
 */
export type ChipType = 'default' | 'filter';
