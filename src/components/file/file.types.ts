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
}
