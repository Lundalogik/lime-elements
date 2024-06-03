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
