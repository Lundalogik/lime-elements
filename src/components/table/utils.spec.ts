import { areRowsEqual } from './utils';

describe('Table - areRowsEqual', () => {
    it('returns false when arrays have different lengths', () => {
        const newData = [{ id: 1, name: 'John' }];
        const oldData = [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
        ];

        expect(areRowsEqual(newData, oldData)).toBe(false);
    });

    it('returns true when arrays are identical', () => {
        const newData = [{ id: 1, name: 'John' }];
        const oldData = [{ id: 1, name: 'John' }];

        expect(areRowsEqual(newData, oldData)).toBe(true);
    });

    it('returns false when arrays have same length but different content', () => {
        const newData = [{ id: 1, name: 'John' }];
        const oldData = [{ id: 1, name: 'Jane' }];

        expect(areRowsEqual(newData, oldData)).toBe(false);
    });

    it('returns false when arrays have same content but different order', () => {
        const newData = [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
        ];
        const oldData = [
            { id: 2, name: 'Jane' },
            { id: 1, name: 'John' },
        ];

        expect(areRowsEqual(newData, oldData)).toBe(false);
    });
});
