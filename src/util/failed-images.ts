const failedImageSrcs = new Set<string>();

/**
 * Remembers that the image at `src` failed to load, so that a component can
 * show something else the next time it is given the same address.
 *
 * @param src - the address of the image
 * @internal
 */
export function rememberFailedImage(src: string): void {
    failedImageSrcs.add(src);
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
