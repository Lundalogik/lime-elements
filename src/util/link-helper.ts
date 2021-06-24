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
