import { ListSeparator } from '../../global/shared-types/separator.types';
import { Icon } from '../../global/shared-types/icon.types';
import { MenuItem } from '../menu/menu.types';
import { Image } from '../../global/shared-types/image.types';
import { Color } from '../../global/shared-types/color.types';

/**
 * List item.
 * @public
 */
export interface ListItem<T = any> {
    /**
     * Text to display in the list item.
     */
    text: string;

    /**
     * Additional supporting text to display in the list item.
     */
    secondaryText?: string;

    /**
     * True if the list item should be disabled.
     */
    disabled?: boolean;

    /**
     * Icon of the list item.
     */
    icon?: string | Icon;

    /**
     * Background color of the icon. Overrides `--icon-background-color`.
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
    iconColor?: Color;

    /**
     * True if the list item should be selected.
     */
    selected?: boolean;

    /**
     * Set to `true` to visualize the item in an "invalid" or "error" state.
     *
     * :::note
     * This flag is currently only honoured when the item is rendered as a
     * chip by `limel-picker`. It has no visual effect in plain lists or
     * menus today; see the `limel-list` / `limel-menu` roadmap for when
     * that support is added.
     * :::
     */
    invalid?: boolean;

    /**
     * Value of the list item.
     */
    value?: T;

    /**
     * List of actions to display as a menu at the end of the item.
     */
    actions?: Array<MenuItem | ListSeparator>;

    /**
     * Component used to render the list item.
     */
    primaryComponent?: ListComponent;

    /**
     * A picture to be displayed together with the icon
     * or on its own, in the list item.
     */
    image?: Image;
}

/**
 * Component used to render a list item.
 * @public
 */
export interface ListComponent {
    /**
     * The name of the custom component.
     */
    name: string;

    /**
     * Properties to send to the custom component.
     */
    props?: Record<string, any>;
}

export { ListSeparator } from '../../global/shared-types/separator.types';
