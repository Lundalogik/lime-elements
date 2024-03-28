import parse from 'style-to-object';
import parseCSSColor from 'parse-css-color';
import { allowedCssProperties } from './allowed-css-properties';

/**
 * Checks a node for a `style` attribute and, if found, sanitizes it.
 *
 * @param node - node to check
 */
export function sanitizeStyle(node: any) {
    if (node.tagName && node.properties && node.properties.style) {
        // Sanitize the 'style' attribute of the node.
        node.properties.style = sanitizeStyleValue(node.properties.style);
    }
}

/**
 * Applies a whitelist to the CSS properties in the input string.
 * Any CSS properties not in the whitelist will be removed.
 *
 * @param styleValue - a string with CSS properties and values
 * @returns a sanitized version of the input string
 */

export function sanitizeStyleValue(styleValue: string): string {
    try {
        const css = parse(styleValue);
        const normalizedCss = normalizeBackgroundColor(css);

        return Object.entries(normalizedCss)
            .filter(([key]) => allowedCssProperties.includes(key))
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse style value', styleValue, error);

        return '';
    }
}

/**
 * Returns a copy of the input object with the `background` property removed.
 * If the `background` property's value was a valid CSS color value, the
 * returned object will have a `background-color` property with the same value.
 *
 * @param css - an object with CSS properties as keys and CSS values as values
 * @returns a modified copy of the input object
 */

export function normalizeBackgroundColor(css: Record<string, string>) {
    const result = { ...css };
    delete result.background;

    if ('background' in css && isValidCssColorValue(css.background)) {
        result['background-color'] = css.background;
    }

    return result;
}

/**
 * Check if a value is a valid CSS color value.
 * Note that this function is not 100% comprehensive. It does not support
 * `currentColor` or `inherit`. It also does not support `var(--variable)` or
 * `rgb(var(--variable))`, for example.
 *
 * @param value - a string to check
 * @returns `true` if the value is a valid CSS color value, `false` otherwise
 */
export function isValidCssColorValue(value: string): boolean {
    return parseCSSColor(value) !== null;
}
