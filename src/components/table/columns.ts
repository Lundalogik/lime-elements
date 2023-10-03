import {
    Column,
    ColumnSorter,
    ColumnAggregatorFunction,
} from '../../interface';
import Tabulator from 'tabulator-tables';
import { escape } from 'html-escaper';
import { ElementPool } from './element-pool';
import { pickBy, negate } from 'lodash-es';

export class ColumnDefinitionFactory {
    constructor(private pool: ElementPool) {
        this.create = this.create.bind(this);
    }

    /**
     * Create Tabulator column definitions from a limel-table column configuration
     * @param {Column} column config describing the column
     * @returns {Tabulator.ColumnDefinition} Tabulator column
     */
    public create(column: Column<object>): Tabulator.ColumnDefinition {
        const definition: Tabulator.ColumnDefinition = {
            title: column.title,
            field: column.field,
            hozAlign: column.horizontalAlign,
            headerSort: column.headerSort,
        };

        if (column.headerComponent) {
            definition.titleFormatter = formatHeader(column);
        }

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
 * Formats the header of the column
 * @param {Column} column the configuration for the column
 * @returns {string | HTMLElement} custom component that renders a column header
 */
export const formatHeader = (column: Column) => (): string | HTMLElement => {
    const headerElement = document.createElement('div');
    headerElement.setAttribute('class', 'lime-col-title__custom-component');

    const titleElement = document.createElement('span');
    titleElement.setAttribute('class', 'title-component-text');
    titleElement.innerText = column.title;

    const customElement = document.createElement(column.headerComponent.name);
    customElement.setAttribute('class', 'title-component-slot');

    let props: object = column.headerComponent.props || {};
    if (column.headerComponent.propsFactory) {
        props = {
            ...props,
            // we pass null to propsFactory function because no data in column header
            ...column.headerComponent.propsFactory(null),
        };
    }

    setElementProperties(customElement, props);

    headerElement.appendChild(titleElement);
    headerElement.appendChild(customElement);

    return headerElement;
};

/**
 * Create a formatter to be used to format values in a column
 * @param {Column} column config describing the column
 * @param {ElementPool} pool pool to get custom components from
 * @returns {Tabulator.Formatter} Tabulator formatter
 */
export function createFormatter(
    column: Column,
    pool: ElementPool
): Tabulator.Formatter {
    if (!column.component?.name) {
        return formatCell;
    }

    if (!columnElementExists(column)) {
        // eslint-disable-next-line no-console
        console.warn(
            `Failed to render custom component for column "${column.field.toString()}". Custom element <${
                column.component.name
            }/> does not exist. Using the default formatter.`
        );

        return formatCell;
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
 * @param {Tabulator.CellComponent} cell the cell being rendered in the table
 * @param {Column} column configuration for the current column
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

    if (typeof value === 'string' && !column.component) {
        value = escape(value);
    }

    return value;
}

/**
 * Create a custom component that renders a cell value
 * @param {Tabulator.CellComponent} cell Tabulator cell
 * @param {Column} column lime-elements column configuration
 * @param {string} value the value of the cell being rendered
 * @param {ElementPool} pool pool to get custom components from
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
    setElementProperties(element, props);

    createResizeObserver(element, cell.getColumn());

    return element;
}

/**
 * Set all properties for a custom element, including event listeners
 * @param {HTMLElement} element the custom element
 * @param {object} props object of properties and event listeners
 */
export function setElementProperties(element: HTMLElement, props: object) {
    const properties = pickBy(props, negate(isEventListener));
    Object.assign(element, properties);

    const listeners = pickBy(props, isEventListener);
    Object.entries(listeners).forEach(([key, value]) => {
        const event = getEventName(key);
        element.addEventListener(event, value as any);
    });
}

/**
 * Check if a property is an event listener.
 *
 * An event listener has to be a function and its property name have to start
 * with "on" followed by the name of the event in camel case, e.g. "onEventName"
 * @param {any} value the value to check
 * @param {string} key name of the property
 * @returns {boolean} true if the property of the object is an event listener
 */
function isEventListener(value: any, key: string): boolean {
    if (typeof value !== 'function') {
        return false;
    }

    return /^on[A-Z]/.test(key);
}

/**
 * Get the name of an event from the name of an event listener
 *
 * E.g. "onMyEvent" will return "myEvent"
 * @param {string} eventListener name of the event listener
 * @returns {string} the name of the event
 */
function getEventName(eventListener: string): string {
    // eslint-disable-next-line no-magic-numbers
    return eventListener.charAt(2).toLowerCase() + eventListener.slice(3);
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
 * @param {Column[]} columns all available columns in the table
 * @returns {Function} function that creates a sorter from a tabulator sorter
 */
export const createColumnSorter =
    (columns: Column[]) =>
    (sorter: TabulatorSorter): ColumnSorter => {
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
