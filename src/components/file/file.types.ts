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
}
