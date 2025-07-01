/**
 *
 * @param value
 */
export function getHref(value: string) {
    const href = value ? String(value.trim()) : '';
    if (isValid(href)) {
        return href;
    }

    return prependProtocol(href);
}

/**
 *
 * @param value
 */
export function getTarget(value: string) {
    const url = getHref(value);
    if (isRelativeLink(url)) {
        return '_self';
    }

    return '_blank';
}

/**
 *
 * @param input
 */
export function prependProtocol(input: string) {
    if (!input) {
        return input;
    }

    return 'https://' + input;
}

function isValid(href: string) {
    return (
        hasKnownProtocol(href) ||
        isRelativeLink(href) ||
        hasRelativeProtocol(href)
    );
}

/**
 *
 * @param input
 */
export function hasKnownProtocol(input: string) {
    const knownProtocols = [
        'ftp',
        'ftps',
        'https',
        'http',

        // `file` may or may not work, due to cross-origin restrictions and browser settings.
        'file',

        // m-files is a protocol used by the M-Files desktop app or something.
        // It's not a web protocol, but it allows open M-Files links in their app.
        'm-files',
    ];

    return knownProtocols.some((knownProtocol) => {
        return input.startsWith(knownProtocol + '://');
    });
}

function isRelativeLink(input: string) {
    if (hasRelativeProtocol(input)) {
        return false;
    }

    return input.startsWith('/') || input.startsWith('#');
}

function hasRelativeProtocol(input: string) {
    return input.startsWith('//');
}

/**
 * Returns the appropriate `rel` attribute value for a link.
 *
 * If an explicit `rel` value is provided, it will be used.
 * Otherwise, when `target` is `_blank`, automatically returns
 * `"noopener noreferrer"` for improved security.
 *
 * @param target - The target attribute value (e.g., "_blank", "_self")
 * @param explicitRel - An explicitly provided rel attribute value
 * @returns The rel attribute value to use, or undefined if none needed
 */
export function getRel(target?: string | null, explicitRel?: string | null) {
    if (explicitRel !== undefined) {
        return explicitRel.trim() || undefined;
    }

    if (target?.trim().toLowerCase() === '_blank') {
        return 'noopener noreferrer';
    }
}
