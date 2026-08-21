import { ListSeparator } from '../../global/shared-types/separator.types';
import { PickerItem } from './picker-item.types';
import { getValueId, hasPickableItems } from './picker-helpers';

const blueberry: PickerItem<number> = { text: 'Blueberry', value: 1 };
const header: ListSeparator = { separator: true, text: 'Results matching "b"' };

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
