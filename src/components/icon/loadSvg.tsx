import { globalConfig } from '../../global/config';
import iconCache from '../../global/icon-cache/factory';

/**
 * Load the SVG data for the icon from the icon cache
 *
 * @param name - name of the icon
 * @returns the icon SVG data
 */
export function loadSvg(name: string) {
    return iconCache.get(name, globalConfig.iconPath);
}
