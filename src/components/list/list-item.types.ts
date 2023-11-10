import { Icon } from '../../global/shared-types/icon.types';
import { MenuItem } from '../menu/menu.types';

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
     * Name of the icon to use.
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
    iconColor?: string;

    /**
     * True if the list item should be selected.
     */
    selected?: boolean;

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
}

/**
 * Indicates that a separator should be rendered in the list.
 * @public
 */
export interface ListSeparator {
    /**
     * Indicates that a separator should be rendered in the list.
     */
    separator: true;

    /**
     * Text to display in the separator.
     * This can be used as a label for the section of the list following the separator.
     * If not specified, the separator will be rendered without a label.
     */
    text?: string;
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
