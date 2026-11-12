import { Column, ColumnSorter, RowData } from './table.types';
import { isEmpty, toNumber, toText } from './values';

const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
});

const KIND_EMPTY = 0;
const KIND_NUMBER = 1;
const KIND_DATE = 2;
const KIND_BOOLEAN = 3;
const KIND_TEXT = 4;

const getKind = (value: unknown): number => {
    if (isEmpty(value)) {
        return KIND_EMPTY;
    }

    if (toNumber(value) !== undefined) {
        return KIND_NUMBER;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? KIND_TEXT : KIND_DATE;
    }

    return typeof value === 'boolean' ? KIND_BOOLEAN : KIND_TEXT;
};

/**
 * Compares two cell values for an ascending sort. Values of different kinds
 * are kept apart, in this order: empty values, numbers and numeric strings,
 * dates, booleans, and then everything else as text. Text is compared
 * ignoring case, and digits inside it are read as numbers. A date that is
 * not valid counts as text.
 *
 * @param a - the first value
 * @param b - the second value
 * @returns a negative number when `a` comes first, a positive number when
 * `b` comes first, and `0` when they are equal
 */
export function compareValues(a: unknown, b: unknown): number {
    const kind = getKind(a);
    if (kind !== getKind(b)) {
        return kind - getKind(b);
    }

    if (kind === KIND_NUMBER) {
        const first = toNumber(a);
        const second = toNumber(b);

        return first === second ? 0 : first - second;
    }

    if (kind === KIND_DATE) {
        return (a as Date).getTime() - (b as Date).getTime();
    }

    if (kind === KIND_BOOLEAN) {
        return Number(a) - Number(b);
    }

    return kind === KIND_TEXT ? collator.compare(toText(a), toText(b)) : 0;
}

/**
 * Sorts rows without changing the given array. When there are several
 * sorters, the last one decides first and the ones before it break ties.
 *
 * @param rows - the rows to sort
 * @param sorters - the columns to sort on, and in which direction
 * @returns the sorted rows
 */
export function sortRows<T extends RowData>(
    rows: T[],
    sorters: ColumnSorter[]
): T[] {
    if (sorters.length === 0) {
        return rows;
    }

    return [...rows].sort((a, b) => {
        for (let index = sorters.length - 1; index >= 0; index--) {
            const { column, direction } = sorters[index];
            const result = compareValues(a[column.field], b[column.field]);
            if (result !== 0) {
                return direction === 'ASC' ? result : -result;
            }
        }

        return 0;
    });
}

/**
 * Works out the sorting after a column header has been clicked. A column
 * that is not sorted yet starts as descending; a sorted one flips.
 *
 * @param current - the sorting before the click
 * @param column - the column whose header was clicked
 * @param additive - `true` to keep the other sorted columns
 * @returns the new sorting
 */
export function getNextSorting(
    current: ColumnSorter[],
    column: Column,
    additive: boolean
): ColumnSorter[] {
    const existing = current.find(
        (sorter) => sorter.column.field === column.field
    );
    const sorter: ColumnSorter = {
        column: column,
        direction: existing?.direction === 'DESC' ? 'ASC' : 'DESC',
    };

    if (!additive) {
        return [sorter];
    }

    return [
        ...current.filter((item) => item.column.field !== column.field),
        sorter,
    ];
}

/**
 * @param sorting - the sorting to describe
 * @returns the field and direction of each sorter, for comparing two sortings
 */
export function describeSorting(sorting: ColumnSorter[] = []) {
    return sorting.map((sorter) => ({
        field: String(sorter.column?.field),
        direction: sorter.direction,
    }));
}
