import { Column, ColumnSorter, ColumnAggregatorFunction } from './table.types';
import Tabulator from 'tabulator-tables';
import { escape } from 'html-escaper';
import { ElementPool } from './element-pool';

export class ColumnDefinitionFactory {
    constructor(private pool: ElementPool) {
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

        if (column.component?.name || column.formatter) {
            definition.formatter = createFormatter(column, this.pool);
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
 * @param {ElementPool} pool pool to get custom components from
 *
 * @returns {Tabulator.Formatter} Tabulator formatter
 */
export function createFormatter(
    column: Column,
    pool: ElementPool
): Tabulator.Formatter {
    if (!column.component) {
        return formatCell;
    }

    if (!columnElementExists(column)) {
        // eslint-disable-next-line no-console
        console.warn(
            `Failed to render custom component for column "${column.field.toString()}". Custom element <${
                column.component.name
            }/> does not exist. Using the default formatter.`
        );

        return;
    }

    return (cell: Tabulator.CellComponent) => {
        const value = formatCell(cell, column);

        return createCustomComponent(cell, column, value, pool);
    };
}

function columnElementExists(column: Column<any>) {
    const name = column.component.name;
    if (typeof name === 'string') {
        const isNativeElement = !name.includes('-');
        const customElementExists = customElements.get(column.component.name);

        return isNativeElement || customElementExists;
    } else {
        return false;
    }
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

    if (typeof value === 'string') {
        value = escape(value);
    }

    return value;
}

/**
 * Create a custom component that renders a cell value
 *
 * @param {Tabulator.CellComponent} cell Tabulator cell
 * @param {Column} column lime-elements column configuration
 * @param {string} value the value of the cell being rendered
 * @param {ElementPool} pool pool to get custom components from
 *
 * @returns {HTMLElement} custom component that renders a value in the table
 */
export function createCustomComponent(
    cell: Tabulator.CellComponent,
    column: Column,
    value: string,
    pool: ElementPool
): HTMLElement {
    const field = cell.getField();
    const data = cell.getData();

    const element = pool.get(column.component.name);
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
        const newWidth = width + COLUMN_PADDING;

        if (newWidth < column.getWidth()) {
            return;
        }

        column.setWidth(newWidth);
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
