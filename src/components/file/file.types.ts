export interface FileInfo {
    /**
     * ID of the file. Must be unique.
     */
    id: number | string;

    /**
     * Name of file.
     */
    filename: string;

    /**
     * Extension of file.
     */
    extension?: string;

    /**
     * Content type of file.
     */
    contentType?: string;

    /**
     * Date of last modification.
     */
    lastModified?: Date;

    /**
     * Size of file.
     */
    size?: number;

    /**
     * the file content
     */
    fileContent?: File;

    /**
     * Name of the icon to use.
     */
    icon?: string;

    /**
     * Icon color. Overrides `--icon-color`.
     */
    iconColor?: string;

    /**
     * Background color of the icon. Overrides `--icon-background-color`.
     */
    iconBackgroundColor?: string;

    /**
     * URL where the file can be downloaded. Note that this is optional. If the
     * file cannot be directly accessed via a unique url, this property should
     * be left undefined or set to `null`.
     */
    href?: string;
}
