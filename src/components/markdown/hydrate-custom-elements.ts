import { CustomElementDefinition } from '../../global/shared-types/custom-element.types';
import { SAFE_PROTOCOLS_BY_PROPERTY } from './safe-url-protocols';

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
            const sanitized = sanitizeUrls(parsed);
            // Set the JS property (camelCase) instead of the attribute
            const propName = attributeToPropName(attrName);
            (element as any)[propName] = sanitized;
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
 * Check whether a URL string uses a safe protocol for the given property.
 * Relative URLs, hash links, and protocol-relative URLs are always allowed.
 * @param value - The URL string to check.
 * @param allowedProtocols - The set of allowed protocols for this property.
 */
function isSafeUrl(value: string, allowedProtocols: Set<string>): boolean {
    const trimmed = value.trim();
    const colonIndex = trimmed.indexOf(':');

    // No colon, or colon appears after ?, #, or / → relative URL, always safe
    if (colonIndex === -1 || /[?#/]/.test(trimmed.slice(0, colonIndex))) {
        return true;
    }

    const protocol = trimmed.slice(0, colonIndex).toLowerCase();

    return allowedProtocols.has(protocol);
}

/**
 * Recursively sanitize URL-bearing properties in a parsed JSON value.
 * Uses the same protocol allowlists as rehype-sanitize to block dangerous
 * schemes (e.g. `javascript:`, `data:`) while allowing safe ones.
 * Covers all URL properties that rehype-sanitize defines protocols for:
 * `href`, `src`, `cite`, and `longDesc`.
 * Unsafe URLs are removed to prevent script injection.
 * @param value
 */
function sanitizeUrls<T>(value: T): T {
    if (value === null || typeof value !== 'object') {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map(sanitizeUrls) as T;
    }

    const result = { ...(value as Record<string, unknown>) };
    for (const key of Object.keys(result)) {
        const allowedProtocols = SAFE_PROTOCOLS_BY_PROPERTY.get(key);
        if (
            allowedProtocols &&
            typeof result[key] === 'string' &&
            !isSafeUrl(result[key] as string, allowedProtocols)
        ) {
            console.warn(
                `limel-markdown: Removed unsafe URL from "${key}" during sanitization.`
            );
            delete result[key];
        } else if (typeof result[key] === 'object' && result[key] !== null) {
            result[key] = sanitizeUrls(result[key]);
        }
    }

    return result as T;
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
