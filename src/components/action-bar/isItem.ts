import { ActionBarItem } from '../action-bar/action-bar.types';
import { ListSeparator } from '../list/list-item.types';

export function isItem(
    item: ActionBarItem | ListSeparator,
): item is ActionBarItem {
    return !('separator' in item);
}
