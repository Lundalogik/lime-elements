import { ListSeparator } from '../list/list-item.types';
import { ActionBarItem } from './action-bar.types';
import { isItem } from './isItem';

describe('isItem', () => {
    it('returns true when item is an ActionBarItem', () => {
        const item: ActionBarItem | ListSeparator = { text: 'test' };
        expect(isItem(item)).toBe(true);
    });

    it('returns false when item is a ListSeparator', () => {
        const item: ActionBarItem | ListSeparator = { separator: true };
        expect(isItem(item)).toBe(false);
    });
});
