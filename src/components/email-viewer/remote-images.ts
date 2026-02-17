/**
 * Checks whether the given HTML contains any images with a `data-remote-src`
 * attribute, indicating they reference external (remote) resources.
 *
 * @param html - The HTML string to inspect.
 */
export function containsRemoteImages(html: string): boolean {
    const parser = new DOMParser();
    const document = parser.parseFromString(html, 'text/html');

    return document.querySelector('img[data-remote-src]') !== null;
}

/**
 * If `allowRemoteImages` is `true`, replaces the `src` attribute of every
 * `<img data-remote-src="...">` element with the value of `data-remote-src`
 * (provided it points to an http(s) URL) and removes the data attribute.
 *
 * When `allowRemoteImages` is `false` the HTML is returned unchanged.
 *
 * Returns an HTML fragment that is safe to assign to `innerHTML` on a regular
 * container element (not a full `<html>/<head>/<body>` document string).
 *
 * @param html - The HTML string to process.
 * @param allowRemoteImages - Whether to restore remote image sources.
 */
export function applyRemoteImagesPolicy(
    html: string,
    allowRemoteImages: boolean
) {
    if (!allowRemoteImages) {
        return html;
    }

    const parser = new DOMParser();
    const document = parser.parseFromString(html, 'text/html');

    const images = document.querySelectorAll(
        'img[data-remote-src]'
    ) as NodeListOf<HTMLImageElement>;

    for (const image of images) {
        const remoteSrc = image.dataset.remoteSrc;
        if (!remoteSrc || !isAllowedRemoteImageUrl(remoteSrc)) {
            delete image.dataset.remoteSrc;
            continue;
        }

        image.setAttribute('src', remoteSrc);
        delete image.dataset.remoteSrc;
    }

    const headStyles = [...document.head.querySelectorAll('style')]
        .map((style) => style.outerHTML)
        .join('');

    return `${headStyles}${document.body.innerHTML}`;
}

function isAllowedRemoteImageUrl(url: string): boolean {
    const trimmed = url.trim();
    const lower = trimmed.toLowerCase();

    return lower.startsWith('https://') || lower.startsWith('http://');
}
