import { Selection } from './selection';

describe('selection', () => {
    let selection: Selection;
    let data: any[];
    beforeEach(() => {
        data = [];
        selection = new Selection((index) => data[index]);
    });
    describe('size', () => {
        it('returns the number of selected items for a non-empty selection', () => {
            selection.items = [{}, {}];
            expect(selection.size).toEqual(2);
        });

        it('returns zero for an empty selection', () => {
            selection.items = [];
            expect(selection.size).toEqual(0);
        });
    });

    describe('has', () => {
        it('returns true for a selected item', () => {
            const a = {};
            selection.items = [a];
            expect(selection.has(a)).toBeTruthy();
        });

        it('returns false for a not selected item', () => {
            const a = {};
            expect(selection.has(a)).toBeFalsy();
        });
    });

    describe('clear', () => {
        it('removes current selection', () => {
            selection.items = [{}];

            const hasSelectionBeforeClear = selection.size > 0;
            selection.clear();

            expect(hasSelectionBeforeClear).toBeTruthy();
            expect(selection.size).toEqual(0);
        });
    });

    describe('toggleSelection', () => {
        it('selects a previously not selected item', () => {
            const a = {};
            const b = {};
            data.push(a, b);
            selection.items = [a];

            selection.toggleSelection(1);

            expect(selection.items).toEqual([a, b]);
        });

        it('de-selects a previously selected item', () => {
            const a = {};
            const b = {};
            data.push(a, b);
            selection.items = [a, b];

            selection.toggleSelection(0);

            expect(selection.items).toEqual([b]);
        });
    });

    describe('toggleSelectionFromLastIndex', () => {
        it('initially only toggles the item at the given index', () => {
            const a = {};
            const b = {};
            data.push(a, b);

            selection.toggleSelectionFromLastIndex(1);

            expect(selection.items).toEqual([b]);
        });

        it('resets last index on clear', () => {
            const a = {};
            const b = {};
            const c = {};
            data.push(a, b, c);

            selection.toggleSelection(0);
            selection.clear();
            selection.toggleSelectionFromLastIndex(2);

            expect(selection.items).toEqual([c]);
        });

        it('resets last index when programmatically changing the selection', () => {
            const a = {};
            const b = {};
            const c = {};
            data.push(a, b, c);

            selection.toggleSelection(0);
            selection.items = [a, b, c];
            selection.toggleSelectionFromLastIndex(2);

            expect(selection.items).toEqual([a, b]);
        });

        it('selects everything from the last toggled item', () => {
            const a = {};
            const b = {};
            const c = {};
            const d = {};
            data.push(a, b, c, d);

            selection.toggleSelection(0);
            selection.toggleSelectionFromLastIndex(2);

            expect(selection.items).toEqual([a, b, c]);
        });

        it('selects up to the last item given an index out of bounds', () => {
            const a = {};
            const b = {};
            data.push(a, b);

            selection.toggleSelection(0);
            selection.toggleSelectionFromLastIndex(1337);

            expect(selection.items).toEqual([a, b]);
        });

        it('toggles from the current state of the given item', () => {
            const a = {};
            const b = {};
            const c = {};
            const d = {};
            data.push(a, b, c, d);

            selection.toggleSelection(0); // [a]
            selection.toggleSelectionFromLastIndex(3); // [a, b, c, d]
            selection.toggleSelectionFromLastIndex(1); // [a]

            expect(selection.items).toEqual([a]);
        });

        it('selects everything from the last toggled item from down-up', () => {
            const a = {};
            const b = {};
            const c = {};
            data.push(a, b, c);

            selection.toggleSelection(2);
            selection.toggleSelectionFromLastIndex(0);

            expect(selection.items).toEqual([a, b, c]);
        });

        it('de-selects everything from the last toggled item', () => {
            const a = {};
            const b = {};
            const c = {};
            const d = {};
            data.push(a, b, c, d);
            selection.items = [a, b, c, d];

            selection.toggleSelection(0);
            selection.toggleSelectionFromLastIndex(2);

            expect(selection.items).toEqual([d]);
        });

        it('de-selects everything from the last toggled item from down-up', () => {
            const a = {};
            const b = {};
            const c = {};
            data.push(a, b, c);
            selection.items = [a, b, c];

            selection.toggleSelection(2);
            selection.toggleSelectionFromLastIndex(0);

            expect(selection.items).toEqual([]);
        });
    });
});
