import { CustomElementDefinition } from '../../global/shared-types/custom-element.types';

/**
 * After innerHTML is set on a container, custom elements receive all
 * attribute values as strings. This function walks whitelisted custom
 * elements and parses any attribute values that look like JSON objects
 * or arrays, setting them as JS properties instead.
 *
 * This enables markdown content to include custom elements with complex
 * props, e.g.:
 * ```html
 * <limel-chip text="GitHub" link='{"href":"https://github.com","target":"_blank"}'></limel-chip>
 * ```
 *
 * @param container - The root element to search within.
 * @param whitelist - The list of whitelisted custom element definitions.
 */
export function hydrateCustomElements(
    container: HTMLElement | null | undefined,
    whitelist: CustomElementDefinition[] | null | undefined
): void {
    if (!container || !whitelist?.length) {
        return;
    }

    for (const definition of whitelist) {
        const elements = container.querySelectorAll(definition.tagName);
        for (const element of elements) {
            hydrateElement(element, definition.attributes);
        }
    }
}

function hydrateElement(element: Element, attributes: string[]): void {
    for (const attrName of attributes) {
        const value = element.getAttribute(attrName);
        if (!value) {
            continue;
        }

        const parsed = tryParseJson(value);
        if (parsed !== undefined) {
            // Set the JS property (camelCase) instead of the attribute
            const propName = attributeToPropName(attrName);
            (element as any)[propName] = parsed;
        }
    }
}

function tryParseJson(value: string) {
    const trimmed = value.trim();
    if (
        (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))
    ) {
        try {
            return JSON.parse(trimmed);
        } catch {
            // The sanitizer may HTML-encode quotes inside attribute values.
            // Try decoding common HTML entities before giving up.
            try {
                const decoded = trimmed
                    .replaceAll('&#x22;', '"')
                    .replaceAll('&#34;', '"')
                    .replaceAll('&quot;', '"')
                    .replaceAll('&#x27;', "'")
                    .replaceAll('&#39;', "'")
                    .replaceAll('&apos;', "'")
                    .replaceAll('&amp;', '&');

                return JSON.parse(decoded);
            } catch {
                return;
            }
        }
    }
}

/**
 * Convert a kebab-case attribute name to a camelCase property name.
 * e.g. "menu-items" → "menuItems"
 * @param attrName
 */
function attributeToPropName(attrName: string): string {
    return attrName.replaceAll(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase()
    );
}
