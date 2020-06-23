export interface Column<T extends object = any> {
    /**
     * Column title to be displayed
     */
    title: string;

    /**
     * Name of the field in the data
     */
    field: keyof T;

    /**
     * Function to format the value before rendering
     */
    formatter?: TableFormatter;

    /**
     * Component used to render the field value
     */
    component?: TableComponentDefinition;
}

export type TableFormatter = (value: any, data?: object) => string;

export interface TableComponentDefinition {
    /**
     * Name of the component
     */
    name: string;

    /**
     * Properties to send to the component
     */
    props?: Record<string, any>;
}

export interface TableComponent<T extends object = any> {
    /**
     * Name of the field being rendered
     */
    field?: string;

    /**
     * Value being rendered
     */
    value?: any;

    /**
     * Data for the current row of the table
     */
    data?: T;
}

export interface ColumnSorter {
    /**
     * The column being sorted
     */
    column: Column;

    /**
     * The direction to sort on
     */
    direction: 'ASC' | 'DESC';
}

export interface TableParams {
    /**
     * The current page being set
     */
    page: number;

    /**
     * Sorters applied to the current page
     */
    sorters?: ColumnSorter[];
}
