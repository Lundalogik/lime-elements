const failedImageSrcs = new Set<string>();

const forgetFailedImages = () => failedImageSrcs.clear();

/**
 * Remembers that the image at `src` failed to load, so that a component can
 * show something else the next time it is given the same address. When the
 * browser comes back online, the failures are forgotten, so that the images
 * are tried again.
 *
 * @param src - the address of the image
 * @internal
 */
export function rememberFailedImage(src: string): void {
    failedImageSrcs.add(src);
    globalThis.addEventListener?.('online', forgetFailedImages);
}

/**
 * Returns whether the image at `src` has failed to load on this page before.
 *
 * @param src - the address of the image
 * @internal
 */
export function hasImageFailed(src: string): boolean {
    return failedImageSrcs.has(src);
}
