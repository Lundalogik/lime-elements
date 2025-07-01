import { LinkMarkAttrs } from './link-mark-spec';

/**
 *
 * @param url
 * @param title
 */
export function getLinkAttributes(
    url: string,
    title: string | null
): LinkMarkAttrs {
    if (isExternalUrl(url)) {
        return {
            href: url,
            title: title,
            target: '_blank',
            rel: 'noopener noreferrer',
            referrerpolicy: 'noreferrer',
        };
    }

    return {
        href: url,
        title: title,
        target: null,
        rel: null,
        referrerpolicy: null,
    };
}

function isExternalUrl(url: string): boolean {
    try {
        let urlObj: URL;

        if (isProtocolRelativeUrl(url)) {
            urlObj = new URL(window.location.protocol + url);
        } else {
            urlObj = new URL(url, window.location.origin);
        }

        return (
            urlObj.protocol.startsWith('http') &&
            urlObj.hostname !== window.location.hostname
        );
    } catch {
        // Malformed URLs → internal
        return false;
    }
}

function isProtocolRelativeUrl(url: string) {
    return url.startsWith('//');
}
