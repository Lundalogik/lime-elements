import { Icon } from '../../interface';

/**
 * Get the icon name.
 * This helps in setting the right icon, both if the consumer only types `icon: string`,
 * and if they use the `Icon` interface for writing the icon name.
 *
 * @param {string | Icon | undefined} icon - The icon to retrieve the name from.
 * @returns {string | undefined} The icon name or the provided string, or `undefined` if `icon` is falsy.
 */
export function getIconName(
    icon: string | Icon | undefined,
): string | undefined {
    if (typeof icon === 'object' && 'name' in icon) {
        return icon.name;
    }

    if (typeof icon === 'string') {
        return icon;
    }

    return undefined;
}

/**
 * Get the icon color.
 * This is added because the old way of specifying `iconColor`
 * deprecated in our components. So consumers should now use the new
 * `Icon` interface instead. But our components must still support the
 * old way of writing `iconColor: string`.
 *
 * @param {string | Icon | undefined} icon - The icon to retrieve the color from.
 * @param {string | undefined} [iconColor] - The color to use when the deprecated `iconColor` is used.
 * @returns {string | undefined} The icon color or the provided color string, or `undefined` if `iconColor` is falsy.
 */
export function getIconColor(
    icon: string | Icon | undefined,
    iconColor?: string | undefined,
): string | undefined {
    if (typeof icon === 'object' && 'color' in icon) {
        return icon.color;
    }

    if (typeof icon === 'string') {
        return iconColor;
    }

    return undefined;
}

/**
 * Get the icon color.
 * This is added because the old way of specifying `iconFillColor` is
 * deprecated in our components. So consumers should now use the new
 * `Icon` interface instead. But our components must still support the
 * old way of writing `iconFillColor: string`.
 *
 * @param {string | Icon} icon - The icon to retrieve the color from.
 * @param {string | undefined} [iconFillColor] - The color to use when `iconFillColor` is used.
 * @returns {string | undefined} The icon color or the provided color string, or `undefined` if `iconColor` is falsy.
 */
export function getIconFillColor(
    icon: string | Icon | undefined,
    iconFillColor?: string | undefined,
): string {
    if (typeof icon === 'object' && 'color' in icon) {
        return icon.color;
    }

    if (typeof icon === 'string') {
        return iconFillColor;
    }

    return undefined;
}

/**
 * Get the icon background color.
 * This function is used to retrieve the background color associated with an icon,
 * whether provided as a string or using the `Icon` interface.
 *
 * @param {string | Icon | undefined} icon - The icon to retrieve the background color from.
 * @param {string | undefined} [iconBackgroundColor] - The background color to use when provided explicitly.
 * @returns {string | undefined} The icon background color or the provided background color string, or `undefined` if `iconBackgroundColor` is falsy.
 */
export function getIconBackgroundColor(
    icon: string | Icon | undefined,
    iconBackgroundColor?: string | undefined,
): string | undefined {
    if (typeof icon === 'object' && 'backgroundColor' in icon) {
        return icon.backgroundColor;
    }

    if (typeof icon === 'string') {
        return iconBackgroundColor;
    }

    return undefined;
}

/**
 * Get the icon title.
 * This function is used to retrieve the title associated with an icon, whether provided as a string or using the `Icon` interface.
 *
 * @param {string | Icon | undefined} icon - The icon to retrieve the title from.
 * @param {string | undefined} [iconTitle] - The title to use when provided explicitly.
 * @returns {string | undefined} The icon title or the provided title string, or `undefined` if `iconTitle` is falsy.
 */
export function getIconTitle(
    icon: string | Icon | undefined,
    iconTitle?: string | undefined,
): string | undefined {
    if (typeof icon === 'object' && 'title' in icon) {
        return icon.title;
    }

    if (typeof icon === 'string') {
        return iconTitle;
    }

    return undefined;
}
