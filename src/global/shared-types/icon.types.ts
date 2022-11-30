export interface Icon {
    /**
     * The name of the icon to load.
     */
    name: string;

    /**
     * SVG markup to use, instead of loading a named icon from a file.
     * If this is supplied, the `name` property is still required, but
     * its value will be ignored.
     */
    src?: string;

    /**
     * The color to use for the icon.
     */
    color?: string;

    /**
     * The title of the icon. Shown on hover and read by assistive technology.
     */
    title?: string;
}
