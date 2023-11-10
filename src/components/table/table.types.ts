/**
 * Defines the data for a table
 * @public
 */
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

    /**
     * Type of aggregator to use for the column
     */
    aggregator?: ColumnAggregatorType | ColumnAggregatorFunction<T>;

    /**
     * A component used to render inside the column header
     */
    headerComponent?: TableComponentDefinition;

    /**
     * Sets the horizontal text alignment for the column
     */
    horizontalAlign?: 'left' | 'center' | 'right';

    /**
     * Defines whether end-user can sort a column
     */
    headerSort?: boolean;
}

/**
 * Definition for a formatter function
 * @param value - The value to be formatted
 * @param data - The data for the current row
 * @returns The formatted value
 * @public
 */
export type TableFormatter = (value: any, data?: object) => string;

/**
 * The `component` key in the schema uses this interface to define a
 * component to be rendered inside a cell in the table.
 *
 * @note The table will display the component as `inline-block` in order
 * to give the column the correct size. If the component should have the
 * full width of the column, this might have to be overridden by setting
 * the display mode to `block`, e.g.
 *
 * ```css
 * :host(*) {
 *     display: block !important;
 * }
 * ```
 * @public
 */
export interface TableComponentDefinition {
    /**
     * Name of the component
     */
    name: string;

    /**
     * Properties to send to the component
     */
    props?: Record<string, any>;

    /**
     * Factory for creating properties dynamically for a custom component.
     *
     * The properties returned from this function will be merged with the
     * `props` properties when the component is created.
     *
     * When the propsFactory is used for header components there will be no data available.
     *
     * @param data - The data for the current row
     * @returns Properties for the component
     */
    propsFactory?: (data: object) => Record<string, any>;
}

/**
 * Interface for custom components rendered inside a `limel-table`.
 * @public
 */
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

/**
 * Indicates whether the specified column is sorted ascending or descending.
 * @public
 */
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

/**
 * Specifies the current page, and which columns the table is currently sorted on.
 * @public
 */
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

/**
 * The built-in aggregators available for columns
 * @public
 */
export enum ColumnAggregatorType {
    /**
     * Calculates the average value of all numerical cells in the column
     */
    Average = 'avg',

    /**
     * Displays the maximum value from all numerical cells in the column
     */
    Maximum = 'max',

    /**
     * Displays the minimum value from all numerical cells in the column
     */
    Minimum = 'min',

    /**
     * Displays the sum of all numerical cells in the column
     */
    Sum = 'sum',

    /**
     * Counts the number of non empty cells in the column
     */
    Count = 'count',
}

/**
 * Instead of using one of the built-in aggregators, it is possible to
 * define a custom aggregator function.
 *
 * @param column - the configuration for the column
 * @param values - list of all values to be aggregated
 * @param data - list of all objects to be aggregated
 * @returns the aggregated data
 *
 * @public
 */
export type ColumnAggregatorFunction<T = object> = (
    column?: Column,
    values?: any[],
    data?: T[],
) => any;

/**
 * Defines aggregate values for columns
 * @public
 */
export interface ColumnAggregate {
    /**
     * The name of the `Column` field
     */
    field: string;
    /**
     * The aggregate value
     */
    value: any;
}
