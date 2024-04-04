/**
 * This interface is used to specify a path to an image,
 * along with related properties, like alt text.
 * @public
 */
export interface Image {
    /**
     * The path to the image file.
     */
    src: string;

    /**
     * The alternative text of the image, used to improve accessibility.
     */
    alt: string;

    /**
     * The `loading` attribute of the image.
     * - `lazy` means that the image will be loaded only when it is in the viewport.
     * - `eager` means that the image will be loaded as soon as possible.
     */
    loading?: 'lazy' | 'eager';
}
