import { Icon } from '../../interface';

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
    icon?: string | Icon;

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
    iconColor?: string;

    /**
     * Shows a badge within the tab with a specified label
     */
    badge?: number | string;
}
