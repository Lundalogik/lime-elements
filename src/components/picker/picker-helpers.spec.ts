import { ListSeparator } from '../../global/shared-types/separator.types';
import { PickerItem } from './picker-item.types';
import {
    excludePickedItems,
    getValueId,
    hasPickableItems,
} from './picker-helpers';

const blueberry: PickerItem<number> = { text: 'Blueberry', value: 1 };
const blackberry: PickerItem<number> = { text: 'Blackberry', value: 2 };
const header: ListSeparator = { separator: true, text: 'Results matching "b"' };

/**
 * `limel-list` emits a copy of the picked item, not the item itself.
 *
 * @param item - the item that was picked
 * @returns a copy, flagged as selected
 */
function copyPickedItem(item: PickerItem): PickerItem {
    return { ...item, selected: true };
}

describe('getValueId', () => {
    it('returns a primitive value as-is', () => {
        expect(getValueId({ text: 'Blueberry', value: 1 })).toBe(1);
        expect(getValueId({ text: 'Blueberry', value: 'one' })).toBe('one');
    });

    it('returns the `id` of an object value', () => {
        expect(getValueId({ text: 'Blueberry', value: { id: 7 } })).toBe(7);
    });

    it('returns `undefined` for an item without a value', () => {
        expect(getValueId({ text: 'Blueberry' })).toBeUndefined();
        expect(getValueId({ text: 'Blueberry', value: null })).toBeUndefined();
    });
});

describe('hasPickableItems', () => {
    it('is false for an empty list and for separators only', () => {
        expect(hasPickableItems([])).toBe(false);
        expect(hasPickableItems([header])).toBe(false);
    });

    it('is true when at least one item is pickable', () => {
        expect(hasPickableItems([header, blueberry])).toBe(true);
    });
});

describe('excludePickedItems', () => {
    it('removes a picked item even though the list emitted a copy of it', () => {
        const result = excludePickedItems(
            [blueberry, blackberry],
            [copyPickedItem(blackberry)]
        );

        expect(result).toEqual([blueberry]);
    });

    it('keeps `ListSeparator` entries', () => {
        const result = excludePickedItems(
            [header, blueberry, blackberry],
            [copyPickedItem(blackberry)]
        );

        expect(result).toEqual([header, blueberry]);
    });

    it('matches object values by their `id`', () => {
        const anakin: PickerItem = { text: 'Anakin', value: { id: 'a' } };
        const benny: PickerItem = { text: 'Benny', value: { id: 'b' } };

        const result = excludePickedItems(
            [anakin, benny],
            [{ text: 'Anakin', value: { id: 'a' } }]
        );

        expect(result).toEqual([benny]);
    });

    it('can leave nothing but separators, which the caller then rejects', () => {
        const result = excludePickedItems(
            [header, blackberry],
            [copyPickedItem(blackberry)]
        );

        expect(result).toEqual([header]);
        expect(hasPickableItems(result)).toBe(false);
    });

    it('returns the same reference when nothing has been picked', () => {
        const items = [header, blueberry];

        expect(excludePickedItems(items, [])).toBe(items);
    });

    it('ignores nullish holes in the picked items', () => {
        const result = excludePickedItems(
            [blueberry, blackberry],
            [undefined, null, copyPickedItem(blueberry)]
        );

        expect(result).toEqual([blackberry]);
    });

    it('keeps every item when the picked one has no value id', () => {
        const withoutValue: PickerItem = { text: 'No value' };
        const items = [withoutValue, blueberry];

        expect(excludePickedItems(items, [copyPickedItem(withoutValue)])).toBe(
            items
        );
    });

    it('keeps value ids that are falsy but defined', () => {
        const zero: PickerItem<number> = { text: 'Zero', value: 0 };
        const empty: PickerItem<string> = { text: 'Empty', value: '' };

        expect(
            excludePickedItems([zero, empty], [copyPickedItem(zero)])
        ).toEqual([empty]);
        expect(
            excludePickedItems([zero, empty], [copyPickedItem(empty)])
        ).toEqual([zero]);
    });

    it('removes every item sharing the picked value id', () => {
        const twin: PickerItem<number> = { text: 'Twin', value: 1 };

        const result = excludePickedItems(
            [blueberry, twin, blackberry],
            [copyPickedItem(blueberry)]
        );

        expect(result).toEqual([blackberry]);
    });
});
