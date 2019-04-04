import { isArray } from 'lodash-es';

/**
 * Type guard for checking if a value is multiple items or not
 *
 * @param {T | T[]} value the value to check
 *
 * @returns {boolean} true if value is multiple items, false otherwise
 */
export function isMultiple<T>(value: T | T[]): value is T[] {
    return isArray(value);
}
