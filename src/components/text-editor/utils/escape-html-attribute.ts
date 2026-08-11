/**
 * Escapes a value for interpolation into a double-quoted HTML attribute.
 * Attribute values are validated where they are created, but the
 * serializers write raw markup, so they must not trust them to be inert.
 *
 * @param value - the attribute value to escape
 * @returns the escaped value
 */
export const escapeHtmlAttribute = (value: string): string => {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('"', '&quot;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
};
