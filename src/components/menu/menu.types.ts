import { ListItem } from '../list/list-item.types';

export type OpenDirection = 'left' | 'right';

export interface MenuItem extends ListItem {
    /**
     * The additional supporting text is used for shortcut commands and displayed in the list item.
     */
    commandText?: string;
}
