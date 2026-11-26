const EMPTY_VALUES = new Set<unknown>([null, undefined, '']);

/**
 * @param value - a cell value
 * @returns `true` when the cell counts as empty
 */
export function isEmpty(value: unknown): boolean {
    return EMPTY_VALUES.has(value);
}

/**
 * @param value - a cell value
 * @returns the value as a number when it is a number or a numeric string,
 * otherwise `undefined`
 */
export function toNumber(value: unknown): number | undefined {
    if (typeof value === 'number') {
        return Number.isNaN(value) ? undefined : value;
    }

    if (typeof value !== 'string' || value.trim() === '') {
        return undefined;
    }

    const number = Number(value);

    return Number.isNaN(number) ? undefined : number;
}

const isObject = (value: unknown): value is object =>
    typeof value === 'object' && value !== null;

const hasOwnTextForm = (value: object): value is { toString(): string } =>
    typeof value.toString === 'function' &&
    value.toString !== Object.prototype.toString;

/**
 * @param value - a value to show as text in a cell
 * @param seen - the lists that are being checked, so that a list that holds
 * itself does not go on forever
 * @returns `false` for an object that has no text form of its own, and for a
 * list that holds such an object, a symbol or a function
 */
export function hasTextForm(
    value: unknown,
    seen = new Set<unknown>()
): boolean {
    if (!isObject(value)) {
        return true;
    }

    if (!Array.isArray(value)) {
        return (
            !('nodeType' in value) &&
            Object.prototype.toString.call(value) !== '[object Symbol]' &&
            hasOwnTextForm(value)
        );
    }

    if (seen.has(value)) {
        return true;
    }

    seen.add(value);

    return value.every(
        (item) =>
            typeof item !== 'symbol' &&
            typeof item !== 'function' &&
            hasTextForm(item, seen)
    );
}

/**
 * @param value - a value to show as text in a cell
 * @returns the text to show; nothing for missing values, functions, objects
 * that have no text form of their own, and lists that hold such an object
 */
export function toText(value: unknown): string {
    if (typeof value === 'string') {
        return value;
    }

    const isPrimitive =
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'bigint';
    if (isPrimitive) {
        return String(value);
    }

    return isObject(value) && hasTextForm(value) ? value.toString() : '';
}
