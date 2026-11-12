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

const hasOwnTextForm = (value: object): value is { toString(): string } =>
    typeof value.toString === 'function' &&
    value.toString !== Object.prototype.toString;

/**
 * @param value - a value to show as text in a cell
 * @returns the text to show; nothing for missing values, functions, and
 * objects that have no text form of their own
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

    const isObject = typeof value === 'object' && value !== null;

    return isObject && hasOwnTextForm(value) ? value.toString() : '';
}
