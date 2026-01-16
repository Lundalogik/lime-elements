import { Color } from '../../global/shared-types/color.types';
import { Icon, IconName } from '../../global/shared-types/icon.types';

/**
 * Tab interface.
 * @public
 */
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
    icon?: IconName | Icon;

    /**
     * True if the tab should be selected.
     */
    active?: boolean;

    /**
     * Color of the icon.
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
     * Shows a badge within the tab with a specified label
     */
    badge?: number | string;
}
