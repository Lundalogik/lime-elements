export function getHref(value: string) {
    const href = value ? String(value.trim()) : '';
    if (isValid(href)) {
        return href;
    }

    return prependProtocol(href);
}

export function getTarget(value: string) {
    const url = getHref(value);
    if (isRelativeLink(url)) {
        return '_self';
    }

    return '_blank';
}

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

function hasKnownProtocol(input: string) {
    const knownProtocols = ['ftp', 'ftps', 'https', 'http'];

    return knownProtocols.some((knownProtocol) => {
        return input.indexOf(knownProtocol + '://') === 0;
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

export const isUrlAbsolute = (url: string) => {
    const ABSOLUTE = true;
    const RELATIVE = false;

    if (url.indexOf('//') === 0) {
        // URL is protocol-relative
        return ABSOLUTE;
    }
    if (url.indexOf('://') === -1) {
        // URL has no protocol
        return RELATIVE;
    }
    if (url.indexOf('?') > -1 && url.indexOf('://') > url.indexOf('?')) {
        // The first protocol comes after a `?`
        // (it's part of a query-string)
        return RELATIVE;
    }
    if (url.indexOf('#') > -1 && url.indexOf('://') > url.indexOf('#')) {
        // The first protocol comes after a `#`
        // (it's part of an achor)
        return RELATIVE;
    }
    if (url.indexOf('.') === -1) {
        // URL does not contain a dot, i.e. no TLD (= relative, possibly REST)
        return RELATIVE;
    }
    if (url.indexOf('/') === -1) {
        // URL does not contain a single slash (= relative)
        return RELATIVE;
    }
    if (url.indexOf(':') > url.indexOf('/')) {
        // The first colon comes after the first slash (= relative)
        return RELATIVE;
    }
    if (url.indexOf('://') < url.indexOf('.')) {
        // Protocol is defined before first dot (= absolute)
        return ABSOLUTE;
    }

    // Anything else must be relative
    return RELATIVE;
};
