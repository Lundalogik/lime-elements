import { ListSeparator } from '../list/list-item.types';
import { ActionBarItem } from './action-bar.types';

export function isItem(
    item: ActionBarItem | ListSeparator
): item is ActionBarItem {
    return !('separator' in item);
}
