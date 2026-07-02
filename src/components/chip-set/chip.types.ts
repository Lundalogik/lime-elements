import { Image } from '../../global/shared-types/image.types';
import { Icon, IconName } from '../../global/shared-types/icon.types';
import { MenuItem } from '../menu/menu.types';
import { ListSeparator } from '../list-item/list-item.types';
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
    icon?: IconName | Icon;

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
     *
     * For chip-sets of `type="input"`, chips are removable by default.
     * Set this to `false` to "lock" an individual chip so that it cannot
     * be removed by the user — neither via the remove button, nor with
     * Backspace/Delete, nor by the "Clear all" button. Locked chips
     * remain fully interactive (clicks still emit `interact` events).
     *
     * If the entire chip-set is `disabled` or `readonly`, the remove
     * button is hidden on all chips regardless of this flag.
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
     * The value of the badge. Accepts either a number (for counter-style
     * badges) or a short string (e.g. a status label like "Inactive").
     */
    badge?: number | string;

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

    /**
     * Reflects the current value of a progress bar on the chip,
     * visualizing the percentage of an ongoing process.
     * Must be a number between `0` and `100`.
     */
    progress?: number;

    /**
     * Set to `true` to visualize the chip in an "invalid" or "error" state.
     */
    invalid?: boolean;
}

/**
 * This type is used to determine the visual style and behavior of a Chip component.
 * @public
 */
export type ChipType = 'default' | 'filter';
