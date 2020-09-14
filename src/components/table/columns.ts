import { Column, ColumnSorter, ColumnAggregatorFunction } from './table.types';
import Tabulator from 'tabulator-tables';

export class ColumnDefinitionFactory {
    constructor() {
        this.create = this.create.bind(this);
    }

    /**
     * Create Tabulator column definitions from a limel-table column configuration
     *
     * @param {Column} column config describing the column
     *
     * @returns {Tabulator.ColumnDefinition} Tabulator column
     */
    public create(column: Column<object>): Tabulator.ColumnDefinition {
        const definition: Tabulator.ColumnDefinition = {
            title: column.title,
            field: column.field,
        };

        if (column.component || column.formatter) {
            definition.formatter = createFormatter(column);
            definition.formatterParams = column as object;
        }

        if (column.aggregator) {
            definition.bottomCalc = getColumnAggregator(column);
        }

        return definition;
    }
}

/**
 * Create a formatter to be used to format values in a column
 *
 * @param {Column} column config describing the column
 *
 * @returns {Tabulator.Formatter} Tabulator formatter
 */
export function createFormatter(
    column: Column
): Tabulator.Formatter {
    if (!column.component) {
        return formatCell;
    }

    return (cell: Tabulator.CellComponent) => {
        const value = formatCell(cell, column);

        return createCustomComponent(cell, column, value);
    };
}

/**
 * Format the value of a cell in the table
 *
 * @param {Tabulator.CellComponent} cell the cell being rendered in the table
 * @param {Column} column configuration for the current column
 *
 * @returns {string} the formatted value
 */
export function formatCell(
    cell: Tabulator.CellComponent,
    column: Column
): string {
    const data = cell.getData();
    let value = cell.getValue();

    if (column.formatter) {
        value = column.formatter(value, data);
    }

    return value;
}

/**
 * Create a custom component that renders a cell value
 *
 * @param {Tabulator.CellComponent} cell Tabulator cell
 * @param {Column} column lime-elements column configuration
 * @param {string} value the value of the cell being rendered
 *
 * @returns {HTMLElement} custom component that renders a value in the table
 */
export function createCustomComponent(
    cell: Tabulator.CellComponent,
    column: Column,
    value: string
): HTMLElement {
    const field = cell.getField();
    const data = cell.getData();

    const element = document.createElement(column.component.name);
    let props: object = column.component.props || {};
    if (column.component.propsFactory) {
        props = {
            ...props,
            ...column.component.propsFactory(data),
        };
    }

    props = {
        ...props,
        field: field,
        value: value,
        data: data,
    };

    element.style.display = 'inline-block';
    Object.assign(element, props);

    createResizeObserver(element, cell.getColumn());

    return element;
}

function createResizeObserver(
    element: HTMLElement,
    column: Tabulator.ColumnComponent
) {
    if (!('ResizeObserver' in window)) {
        return;
    }

    const RESIZE_TIMEOUT = 1000;
    const COLUMN_PADDING = 16;

    const observer = new ResizeObserver(() => {
        const width = element.getBoundingClientRect().width;

        if (width < column.getWidth()) {
            return;
        }

        column.setWidth(width + COLUMN_PADDING);
    });
    observer.observe(element);

    // We give the component some time to resize itself before we
    // stop listening for resize events
    setTimeout(() => {
        observer.unobserve(element);
    }, RESIZE_TIMEOUT);
}

// Tabulator seems to also have this `field` property, that does not appear on
// the interface for some reason
interface TabulatorSorter extends Tabulator.Sorter {
    field: string;
}

/**
 * Create a column sorter from a tabulator sorter
 *
 * @param {Column[]} columns all available columns in the table
 *
 * @returns {Function} function that creates a sorter from a tabulator sorter
 */
export const createColumnSorter = (columns: Column[]) => (
    sorter: TabulatorSorter
): ColumnSorter => {
    const column = columns.find((col) => col.field === sorter.field);
    const direction = sorter.dir.toUpperCase() as 'ASC' | 'DESC';

    return {
        column: column,
        direction: direction,
    };
};

export function getColumnAggregator(column: Column): Tabulator.ColumnCalc {
    const aggregator = column.aggregator;
    if (isAggregatorFunction(aggregator)) {
        return (values: any[], data: object[]) => {
            return aggregator(column, values, data);
        };
    }

    return aggregator;
}

function isAggregatorFunction(value: any): value is ColumnAggregatorFunction {
    return typeof value === 'function';
}
