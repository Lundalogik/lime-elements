import { createReorderEvent, findDropIndex, moveItem } from './reorder';

describe('findDropIndex', () => {
    const extents = [
        { start: 0, size: 100 },
        { start: 100, size: 50 },
        { start: 150, size: 100 },
    ];

    it('drops in front of an item while the pointer is on its first half', () => {
        expect(findDropIndex(extents, 20)).toBe(0);
        expect(findDropIndex(extents, 110)).toBe(1);
    });

    it('drops after an item once the pointer is on its second half', () => {
        expect(findDropIndex(extents, 60)).toBe(1);
        expect(findDropIndex(extents, 130)).toBe(2);
    });

    it('drops after the last item when the pointer is past it', () => {
        expect(findDropIndex(extents, 240)).toBe(3);
    });

    it('drops first when the pointer is in front of all items', () => {
        expect(findDropIndex(extents, -50)).toBe(0);
    });
});

describe('moveItem', () => {
    const items = ['a', 'b', 'c', 'd'];

    it('moves an item towards the end', () => {
        expect(moveItem(items, 0, 3)).toEqual(['b', 'c', 'a', 'd']);
    });

    it('moves an item to the very end', () => {
        expect(moveItem(items, 1, 4)).toEqual(['a', 'c', 'd', 'b']);
    });

    it('moves an item towards the start', () => {
        expect(moveItem(items, 3, 1)).toEqual(['a', 'd', 'b', 'c']);
    });

    it('does not change the given array', () => {
        moveItem(items, 0, 3);

        expect(items).toEqual(['a', 'b', 'c', 'd']);
    });

    it('returns nothing when the item is dropped where it already is', () => {
        expect(moveItem(items, 1, 1)).toBeUndefined();
        expect(moveItem(items, 1, 2)).toBeUndefined();
    });

    it('returns nothing for an item that is not in the list', () => {
        expect(moveItem(items, -1, 2)).toBeUndefined();
    });
});

describe('createReorderEvent', () => {
    const rows = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

    it('says the row was placed below the row that is now above it', () => {
        expect(createReorderEvent(rows, 0, 3)).toEqual({
            fromRow: rows[0],
            toRow: rows[2],
            above: false,
        });
    });

    it('says the row was placed above the next row when it is moved to the top', () => {
        expect(createReorderEvent(rows, 2, 0)).toEqual({
            fromRow: rows[2],
            toRow: rows[0],
            above: true,
        });
    });

    it('handles a row that is moved to the very end', () => {
        expect(createReorderEvent(rows, 1, 4)).toEqual({
            fromRow: rows[1],
            toRow: rows[3],
            above: false,
        });
    });

    it('returns nothing when the row did not change place', () => {
        expect(createReorderEvent(rows, 1, 2)).toBeUndefined();
    });
});
