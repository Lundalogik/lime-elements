import { isArray } from 'lodash-es';

/**
 * Type guard for checking if a value is multiple items or not
 *
 * @param value - The value to check
 * @returns True if value is multiple items, false otherwise
 */
export function isMultiple<T>(value: T | T[]): value is T[] {
    return isArray(value);
}
