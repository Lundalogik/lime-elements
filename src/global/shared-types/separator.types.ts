/**
 * Indicates that a separator should be rendered.
 * Used in lists and menus to separate items into sections.
 * @public
 */
export interface ListSeparator {
    /**
     * Indicates that a separator should be rendered.
     */
    separator: true;

    /**
     * Text to display in the separator.
     * This can be used as a label for the section following the separator.
     * If not specified, the separator will be rendered without a label.
     */
    text?: string;
}
