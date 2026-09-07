export interface TocEntry {
    id: string;
    title: string;
    children?: TocEntry[];
    /**
     * When true, the entry's children are hidden behind an expand/collapse
     * toggle in the table of contents. Defaults to false.
     */
    collapsible?: boolean;
    /**
     * When true, a collapsible entry starts expanded. The user can still
     * collapse it manually. Ignored when `collapsible` is false.
     */
    defaultExpanded?: boolean;
}
