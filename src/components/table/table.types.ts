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
}

export type TableFormatter = (value: any, data?: object) => string;

/**
 * Definition for a component to be displayed in a cell in the table
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
     * @param {*} data the data for the current row
     * @returns {object} properties for the component
     */
    propsFactory?: (data: object) => Record<string, any>;
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
 * Calculate an aggregated value for a column
 *
 * @param {Column} column the configuration for the column
 * @param {*[]} values list of all values to be aggregated
 * @param {T[]} data list of all objects to be aggregated
 *
 * @returns {*} the aggregated data
 */
export type ColumnAggregatorFunction<T = object> = (
    column?: Column,
    values?: any[],
    data?: T[]
) => any;
