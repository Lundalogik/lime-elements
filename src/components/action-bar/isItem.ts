import { ActionBarItem, ListSeparator } from '../../interface';

export function isItem(
    item: ActionBarItem | ListSeparator
): item is ActionBarItem {
    return !('separator' in item);
}
