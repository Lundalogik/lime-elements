import { MenuItem } from '../../components';
import { Icon } from '../../global/shared-types/icon.types';
import { Color } from './color.types';
import { ListSeparator } from './separator.types';

/**
 * @public
 */
export interface FileInfo {
    /**
     * ID of the file. Must be unique.
     */
    id: number | string;

    /**
     * Name of file.
     */
    filename: string;

    /**
     * Extension of file.
     */
    extension?: string;

    /**
     * Content type of file.
     */
    contentType?: string;

    /**
     * Date of last modification.
     */
    lastModified?: Date;

    /**
     * Size of file.
     */
    size?: number;

    /**
     * the file content
     */
    fileContent?: File;

    /**
     * Name of the icon to use.
     */
    icon?: string | Icon;

    /**
     * Icon color. Overrides `--icon-color`.
     *
     * @deprecated This property is deprecated and will be removed soon!
     *
     * Use the new `Icon` interface instead and write:
     * ```ts
     * icon: {
     *    name: string,
     *    color: string,
     * },
     * ```
     */
    iconColor?: Color;

    /**
     * Background color of the icon. Overrides `--icon-background-color`.
     *
     * @deprecated This property is deprecated and will be removed soon!
     *
     * Use the new `Icon` interface instead and write:
     * ```ts
     * icon: {
     *    name: string,
     *    backgroundColor: string,
     * },
     * ```
     */
    iconBackgroundColor?: Color;

    /**
     * URL where the file can be downloaded. Note that this is optional. If the
     * file cannot be directly accessed via a unique url, this property should
     * be left undefined or set to `null`.
     */
    href?: string;

    /**
     * Custom menu items for the file.
     */
    menuItems?: Array<MenuItem | ListSeparator>;
}
