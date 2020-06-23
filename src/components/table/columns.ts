import { Column, ColumnSorter } from './table.types';

/**
 * Create Tabulator column definitions from a limel-table column configuration
 *
 * @param {Column} column config describing the column
 *
 * @returns {Tabulator.ColumnDefinition} Tabulator column
 */
export function createColumnDefinition(
    column: Column<object>
): Tabulator.ColumnDefinition {
    const definition: Tabulator.ColumnDefinition = {
        title: column.title,
        field: column.field,
    };

    if (column.component || column.formatter) {
        definition.formatter = formatCell;
        definition.formatterParams = column as object;
    }

    return definition;
}

/**
 * Format the value of a cell in the table
 *
 * @param {Tabulator.CellComponent} cell the cell being rendered in the table
 * @param {Column} column configuration for the current column
 *
 * @returns {string|HTMLElement} the formatted value
 */
export function formatCell(
    cell: Tabulator.CellComponent,
    column: Column
): HTMLElement | string {
    const data = cell.getData();
    let value = cell.getValue();

    if (column.formatter) {
        value = column.formatter(value, data);
    }

    if (column.component) {
        return createCustomComponent(cell, column, value);
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
    props = {
        ...props,
        field: field,
        value: value,
        data: data,
    };

    Object.assign(element, props);

    return element;
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
 * @return {Function} function that creates a sorter from a tabulator sorter
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
