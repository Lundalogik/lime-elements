/**
 * This interface is used to specify which icon to use in many components,
 * along with related properties, like color.
 * @public
 */
export interface Icon {
    /**
     * Name of the icon, refers to the icon's filename in lime-icons8 repository.
     */
    name: string;

    /**
     * URL of image to display.
     *
     * If given, this takes precedence over the `name` attribute.
     * Note that the image will be rendered as an `<img>` tag, and not as an
     * inline SVG. This means that, while you can render an external SVG file,
     * you will not be able to change its color using CSS.
     */
    src?: string;

    /**
     * Color of the icon.
     */
    color?: string;

    /**
     * Background color of the icon.
     */
    backgroundColor?: string;

    /**
     * The `title` attribute of the icon.
     * Used primarily to improve accessibility for users who
     * take advantage of assistive technologies; but also
     * to clarify further what an icon tries to resemble
     * for sighted users.
     */
    title?: string;
}
