import {
    createReorderEvent,
    findDropIndex,
    getScrollStep,
    moveItem,
} from './reorder';

describe('getScrollStep', () => {
    it('does not scroll while the pointer is away from the edges', () => {
        expect(getScrollStep(300, 100, 600)).toBe(0);
    });

    it('scrolls back near the start and forward near the end', () => {
        expect(getScrollStep(110, 100, 600)).toBeLessThan(0);
        expect(getScrollStep(590, 100, 600)).toBeGreaterThan(0);
    });

    it('scrolls faster the closer the pointer is to the edge', () => {
        expect(getScrollStep(595, 100, 600)).toBeGreaterThan(
            getScrollStep(570, 100, 600)
        );
    });

    it('scrolls no faster once the pointer is past the edge', () => {
        expect(getScrollStep(900, 100, 600)).toBe(getScrollStep(600, 100, 600));
        expect(getScrollStep(-200, 100, 600)).toBe(
            getScrollStep(100, 100, 600)
        );
    });
});

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
        expect(createReorderEvent(rows, 0, 2)).toEqual({
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

    it('describes the row that moved when the same object is in the rows twice', () => {
        const twice = [rows[0], rows[1], rows[0], rows[2]];

        expect(createReorderEvent(twice, 2, 3)).toEqual({
            fromRow: rows[0],
            toRow: rows[2],
            above: false,
        });
    });

    it('handles a row that is moved to the very end', () => {
        expect(createReorderEvent(rows, 1, 3)).toEqual({
            fromRow: rows[1],
            toRow: rows[3],
            above: false,
        });
    });

    it('returns nothing when the row did not change place', () => {
        expect(createReorderEvent(rows, 1, 1)).toBeUndefined();
    });
});
