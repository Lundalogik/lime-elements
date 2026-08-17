/**
 * MIME types accepted in an image `data:` URL.
 *
 * Raster formats only. `image/svg+xml` is deliberately absent: an SVG document
 * can carry script and its own external references, so it is not safe to embed
 * from untrusted content even though browsers do not execute script for an SVG
 * loaded through `<img>`.
 *
 * @internal
 */
const ALLOWED_IMAGE_MIME_TYPES = new Set([
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/x-icon',
    'image/vnd.microsoft.icon',
]);

/**
 * Extracts the MIME type from a `data:` URL.
 *
 * @param dataUrl - A `data:` URL string.
 * @returns The MIME type if present.
 * @internal
 */
export function getDataUrlMimeType(dataUrl: string): string | undefined {
    // data:[<mime type>][;charset=<charset>][;base64],<data>
    const match = /^data:([^;,]+)(?:;charset=[^;,]+)?(?:;base64)?,/i.exec(
        dataUrl
    );
    const mimeType = match?.[1]?.toLowerCase();

    return mimeType || undefined;
}

/**
 * Whether a URL is a `data:` URL holding an image of an allowed MIME type, and
 * is therefore safe to keep as the source of an image.
 *
 * Any other value — a non-`data:` URL, a `data:` URL without a MIME type, or
 * one whose MIME type is not an allowed image format — is not safe here and
 * must be handled by the caller.
 *
 * @param url - The URL to check.
 * @returns `true` when the URL is an allowed image `data:` URL.
 * @internal
 */
export function isSafeImageDataUrl(url: string): boolean {
    const trimmedUrl = url.trim();

    if (!trimmedUrl.toLowerCase().startsWith('data:')) {
        return false;
    }

    const mimeType = getDataUrlMimeType(trimmedUrl);

    return Boolean(mimeType) && ALLOWED_IMAGE_MIME_TYPES.has(mimeType);
}
