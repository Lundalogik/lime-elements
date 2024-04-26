import { ActionBarItem } from 'src/components/action-bar/action-bar.types';
import { ListSeparator } from 'src/components/list/list-item.types';

export const textEditorMenuItems: Array<ActionBarItem | ListSeparator> = [
    {
        text: 'Bold',
        commandText: '⌘ B',
        icon: 'bold',
        iconOnly: true,
    },
    {
        text: 'Italic',
        commandText: '⌘ I',
        icon: 'italic',
        iconOnly: true,
    },
    {
        text: 'Add or remove link',
        commandText: '⌘ shift U',
        icon: 'link',
        iconOnly: true,
    },
    { separator: true },
    {
        text: 'Header Level 1',
        icon: 'header_1',
        iconOnly: true,
    },
    {
        text: 'Header Level 2',
        icon: 'header_2',
        iconOnly: true,
    },
    {
        text: 'Header Level 3',
        icon: 'header_3',
        iconOnly: true,
    },
    { separator: true },
    {
        text: 'List',
        icon: 'list',
        iconOnly: true,
    },
    {
        text: 'Numbered list',
        icon: 'numbered_list',
        iconOnly: true,
    },
    {
        text: 'Blockquote',
        icon: 'quote_right',
        iconOnly: true,
    },
];
