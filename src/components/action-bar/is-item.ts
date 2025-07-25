import { ActionBarItem } from './action-bar.types';
import { ListSeparator } from '../list/list-item.types';

/**
 *
 * @param item
 */
export function isItem(
    item: ActionBarItem | ListSeparator
): item is ActionBarItem {
    return !('separator' in item);
}
