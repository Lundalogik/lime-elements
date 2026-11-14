import {
    compareValues,
    describeSorting,
    getNextSorting,
    sortRows,
} from './sorting';
import { Column, ColumnSorter } from './table.types';

const name: Column = { title: 'Name', field: 'name' };
const age: Column = { title: 'Age', field: 'age' };

const sorted = (values: unknown[]) =>
    [...values].sort((a, b) => compareValues(a, b));

describe('compareValues', () => {
    it('compares numbers by size, not as text', () => {
        expect(sorted([10, 9, 100, 1])).toEqual([1, 9, 10, 100]);
    });

    it('compares numeric strings as numbers', () => {
        expect(sorted(['10', '9', 100, '1'])).toEqual(['1', '9', '10', 100]);
    });

    it('compares text without regard to case', () => {
        expect(sorted(['b', 'A', 'c', 'B'])).toEqual(['A', 'b', 'B', 'c']);
    });

    it('reads digits inside text as numbers', () => {
        expect(sorted(['item 10', 'item 9', 'item 1'])).toEqual([
            'item 1',
            'item 9',
            'item 10',
        ]);
    });

    it('puts empty values first', () => {
        expect(sorted(['b', null, 'a', ''])).toEqual([null, '', 'a', 'b']);
        expect(compareValues(undefined, 'a')).toBeLessThan(0);
        expect(compareValues('a', undefined)).toBeGreaterThan(0);
        expect(compareValues(null, undefined)).toBe(0);
    });

    it('keeps numbers and text apart, so that the order does not depend on where the values start', () => {
        const values = [2.3, '2.5x', 2.11, 'b', 10];

        expect(sorted(values)).toEqual([2.11, 2.3, 10, '2.5x', 'b']);
        expect(sorted([...values].reverse())).toEqual([
            2.11,
            2.3,
            10,
            '2.5x',
            'b',
        ]);
    });

    it('puts false before true', () => {
        expect(sorted([true, false, true])).toEqual([false, true, true]);
    });

    it('compares dates by time', () => {
        const early = new Date('2020-01-01');
        const late = new Date('2024-01-01');

        expect(sorted([late, early])).toEqual([early, late]);
    });

    it('keeps valid dates in order around a date that is not valid', () => {
        const early = new Date('2020-01-01');
        const late = new Date('2024-01-01');
        const invalid = new Date('not a date');

        expect(sorted([late, invalid, early])).toEqual([early, late, invalid]);
    });
});

describe('sortRows', () => {
    const rows = [
        { id: 1, name: 'Cid', age: 30 },
        { id: 2, name: 'Ann', age: 4 },
        { id: 3, name: 'Bob', age: 120 },
        { id: 4, name: 'Dee', age: 30 },
    ];
    const ids = (sorters: ColumnSorter[]) =>
        sortRows(rows, sorters).map((row) => row.id);

    it('returns the rows untouched when there is nothing to sort on', () => {
        expect(sortRows(rows, [])).toBe(rows);
    });

    it('does not change the given array', () => {
        const before = [...rows];
        sortRows(rows, [{ column: name, direction: 'ASC' }]);

        expect(rows).toEqual(before);
    });

    it('sorts ascending', () => {
        expect(ids([{ column: age, direction: 'ASC' }])).toEqual([2, 1, 4, 3]);
    });

    it('sorts descending', () => {
        expect(ids([{ column: name, direction: 'DESC' }])).toEqual([
            4, 1, 3, 2,
        ]);
    });

    it('keeps the given order for rows that are equal', () => {
        expect(ids([{ column: age, direction: 'DESC' }])).toEqual([3, 1, 4, 2]);
    });

    it('lets the last sorter decide first, and the ones before it break ties', () => {
        expect(
            ids([
                { column: name, direction: 'DESC' },
                { column: age, direction: 'ASC' },
            ])
        ).toEqual([2, 4, 1, 3]);
    });

    it('lets an earlier sorter break a tie between two endless numbers', () => {
        const endless = [
            { id: 1, name: 'Bob', age: Infinity },
            { id: 2, name: 'Ann', age: Infinity },
        ];
        const sorted = sortRows(endless, [
            { column: name, direction: 'ASC' },
            { column: age, direction: 'ASC' },
        ]);

        expect(sorted.map((row) => row.id)).toEqual([2, 1]);
    });

    it('puts rows with an empty value last when descending', () => {
        const withEmpty = [
            { id: 1, age: null },
            { id: 2, age: 5 },
        ];

        expect(
            sortRows(withEmpty, [{ column: age, direction: 'DESC' }]).map(
                (row) => row.id
            )
        ).toEqual([2, 1]);
    });
});

describe('getNextSorting', () => {
    it('starts an unsorted column as descending', () => {
        expect(getNextSorting([], name, false)).toEqual([
            { column: name, direction: 'DESC' },
        ]);
    });

    it('flips a descending column to ascending', () => {
        const current: ColumnSorter[] = [{ column: name, direction: 'DESC' }];

        expect(getNextSorting(current, name, false)).toEqual([
            { column: name, direction: 'ASC' },
        ]);
    });

    it('flips an ascending column to descending', () => {
        const current: ColumnSorter[] = [{ column: name, direction: 'ASC' }];

        expect(getNextSorting(current, name, false)).toEqual([
            { column: name, direction: 'DESC' },
        ]);
    });

    it('replaces the other columns by default', () => {
        const current: ColumnSorter[] = [{ column: age, direction: 'ASC' }];

        expect(getNextSorting(current, name, false)).toEqual([
            { column: name, direction: 'DESC' },
        ]);
    });

    it('adds the column after the others when asked to keep them', () => {
        const current: ColumnSorter[] = [{ column: age, direction: 'ASC' }];

        expect(getNextSorting(current, name, true)).toEqual([
            { column: age, direction: 'ASC' },
            { column: name, direction: 'DESC' },
        ]);
    });

    it('moves a column that is flipped to the end when keeping the others', () => {
        const current: ColumnSorter[] = [
            { column: name, direction: 'DESC' },
            { column: age, direction: 'ASC' },
        ];

        expect(getNextSorting(current, name, true)).toEqual([
            { column: age, direction: 'ASC' },
            { column: name, direction: 'ASC' },
        ]);
    });

    it('finds the column by its field, not by the object', () => {
        const current: ColumnSorter[] = [
            { column: { ...name }, direction: 'DESC' },
        ];

        expect(getNextSorting(current, name, false)[0].direction).toBe('ASC');
    });
});

describe('describeSorting', () => {
    it('describes each sorter by field and direction', () => {
        expect(
            describeSorting([
                { column: name, direction: 'ASC' },
                { column: age, direction: 'DESC' },
            ])
        ).toEqual([
            { field: 'name', direction: 'ASC' },
            { field: 'age', direction: 'DESC' },
        ]);
    });

    it('treats a missing sorting as no sorting', () => {
        expect(describeSorting()).toEqual([]);
    });
});
