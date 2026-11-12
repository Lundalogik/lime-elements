import { Column, RowData } from './table.types';
import { toText } from './values';

/**
 * A component to render, and the properties to give it
 */
export interface ComponentView {
    name: string;
    props: Record<string, any>;
    /**
     * Gives the rendered element its properties
     */
    ref: (element: HTMLElement) => void;
}

/**
 * What a cell shows: either plain text, or a component
 */
export interface CellView {
    /**
     * The value of the field when the view was made, before any formatting
     */
    rawValue: unknown;
    text?: string;
    component?: ComponentView;
    /**
     * The component the column asks for, when the browser does not know it
     * yet and the cell shows text in its place
     */
    missingComponent?: string;
}

const warnedColumns = new WeakSet<Column>();
const columnsWithObjectValues = new WeakSet<Column>();
const columnsWithObjectAggregates = new WeakSet<Column>();
const appliedProps = new WeakMap<HTMLElement, Record<string, any>>();

const isEventListener = (value: unknown, key: string) =>
    typeof value === 'function' && /^on[A-Z]/.test(key);

const getEventNames = (element: HTMLElement, key: string) => {
    const name = key.charAt(2).toLowerCase() + key.slice(3);
    const nativeName = name.toLowerCase();
    const hasNativeEvent =
        nativeName !== name && element[`on${nativeName}`] !== undefined;

    return hasNativeEvent ? [name, nativeName] : [name];
};

/**
 * A native property such as `href` mirrors an attribute, and setting it to
 * `undefined` would write the text "undefined" into that attribute. A native
 * text property that keeps a text of its own, such as the `value` of an
 * input, would show the text "undefined", so it gets an empty text.
 *
 * @param element - the element to update
 * @param key - the name of the property to clear
 */
function clearProperty(element: HTMLElement, key: string) {
    const hadAttribute = element.hasAttribute(key);
    const textBefore = element[key];
    element.removeAttribute(key);

    const isNativeText =
        !element.tagName.includes('-') &&
        Reflect.has(Object.getPrototypeOf(element), key) &&
        typeof element[key] === 'string';
    if (isNativeText) {
        const keepsTextOfItsOwn =
            element[key] !== '' && element[key] === textBefore;
        if (keepsTextOfItsOwn) {
            element[key] = '';
        }
    } else if (!hadAttribute) {
        element[key] = undefined;
    }
}

/**
 * Gives an element its properties. Functions named like `onMyEvent` are
 * added as listeners for `myEvent`, and also for the native event of that
 * name when there is one, such as `keydown` for `onKeyDown`. Everything else
 * is set as a property, so that objects and functions arrive as they are.
 *
 * @param element - the element to update
 * @param props - the properties and event listeners to give it
 */
export function applyProps(
    element: HTMLElement,
    props: Record<string, any>
): void {
    const previous = appliedProps.get(element);
    if (!element || previous === props) {
        return;
    }

    const previousEntries = Object.entries(previous ?? {});
    for (const [key, value] of previousEntries) {
        if (isEventListener(value, key)) {
            for (const name of getEventNames(element, key)) {
                element.removeEventListener(name, value);
            }
        } else if (!Object.hasOwn(props, key)) {
            clearProperty(element, key);
        }
    }

    for (const [key, value] of Object.entries(props)) {
        if (isEventListener(value, key)) {
            for (const name of getEventNames(element, key)) {
                element.addEventListener(name, value);
            }
        } else {
            element[key] = value;
        }
    }

    appliedProps.set(element, props);
}

function createComponentView(
    name: string,
    props: Record<string, any>
): ComponentView {
    return {
        name: name,
        props: props,
        ref: (element) => applyProps(element, props),
    };
}

/**
 * @param column - the column to check
 * @returns `true` when the column renders its values with a component that
 * the browser knows about
 */
export function hasUsableComponent(column: Column): boolean {
    const name = column.component?.name;
    if (!name) {
        return false;
    }

    const isNativeElement = typeof name === 'string' && !name.includes('-');
    if (isNativeElement || customElements.get(name)) {
        return true;
    }

    if (!warnedColumns.has(column)) {
        warnedColumns.add(column);
        console.warn(
            `limel-table: the custom element <${name}> for column "${String(column.field)}" is not registered. The value is shown as text until it is.`
        );
    }

    return false;
}

/**
 * @param column - the column the value belongs to
 * @param value - the value to show in a cell of that column
 * @returns the text to show. An object that has no text form gives an empty
 * text, and one warning per column
 */
export function toCellText(column: Column, value: unknown): string {
    const text = toText(value);
    if (isObjectWithoutText(value, text)) {
        warnOnce(
            columnsWithObjectValues,
            column,
            `limel-table: a value of column "${String(column.field)}" is an object that cannot be shown as text, so its cell is empty. Give the column a \`formatter\` that returns text, or a \`component\`.`
        );
    }

    return text;
}

/**
 * @param column - the column the aggregate belongs to
 * @param value - the aggregate to show under that column
 * @returns the text to show. An object that has no text form gives an empty
 * text, and one warning per column
 */
export function toAggregateText(column: Column, value: unknown): string {
    const text = toText(value);
    if (isObjectWithoutText(value, text)) {
        warnOnce(
            columnsWithObjectAggregates,
            column,
            `limel-table: the aggregate of column "${String(column.field)}" is an object that cannot be shown as text, so it is shown as empty. Let the \`aggregator\` of the column return text or a number.`
        );
    }

    return text;
}

function isObjectWithoutText(value: unknown, text: string): boolean {
    return text === '' && typeof value === 'object' && value !== null;
}

function warnOnce(warned: WeakSet<Column>, column: Column, message: string) {
    if (warned.has(column)) {
        return;
    }

    warned.add(column);
    console.warn(message);
}

/**
 * @param column - the column to check
 * @returns `true` when what a cell of the column shows can depend on other
 * fields of its row than the one of the column
 */
export function readsTheWholeRow(column: Column): boolean {
    return !!column.formatter || !!column.component?.propsFactory;
}

/**
 * @param column - the column the cell belongs to
 * @param row - the data of the row the cell belongs to
 * @returns what the cell shows
 */
export function createCellView(column: Column, row: RowData): CellView {
    const rawValue = row[column.field];
    const value = column.formatter ? column.formatter(rawValue, row) : rawValue;

    if (!column.component?.name) {
        return { rawValue: rawValue, text: toCellText(column, value) };
    }

    if (!hasUsableComponent(column)) {
        return {
            rawValue: rawValue,
            text: toCellText(column, value),
            missingComponent: column.component.name,
        };
    }

    return {
        rawValue: rawValue,
        component: createComponentView(column.component.name, {
            ...column.component.props,
            ...column.component.propsFactory?.(row),
            field: column.field,
            value: value,
            data: row,
        }),
    };
}

/**
 * @param column - a column with a component in its header
 * @returns the component to render in the header
 */
export function createHeaderView(column: Column): ComponentView {
    return createComponentView(column.headerComponent.name, {
        ...column.headerComponent.props,
        ...column.headerComponent.propsFactory?.(null),
    });
}
