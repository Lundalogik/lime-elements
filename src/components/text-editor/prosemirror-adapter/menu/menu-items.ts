import { ActionBarItem } from 'src/components/action-bar/action-bar.types';
import { ListSeparator } from 'src/components/list/list-item.types';

const getCommandSymbols = (): {
    mod: string;
    option: string;
    shift: string;
} => {
    const macUserAgent = /Macintosh|MacIntel|MacPPC|Mac68K/;
    if (navigator.userAgent.match(macUserAgent)) {
        return { mod: '⌘', option: '⌥', shift: '⇧' };
    }

    return { mod: 'Ctrl', option: 'Alt', shift: 'Shift' };
};

const { mod, shift } = getCommandSymbols();

export const textEditorMenuItems: Array<ActionBarItem | ListSeparator> = [
    {
        value: 'strong',
        text: 'Bold',
        commandText: `${mod} B`,
        icon: '-lime-text-bold',
        iconOnly: true,
    },
    {
        value: 'em',
        text: 'Italic',
        commandText: `${mod} I`,
        icon: '-lime-text-italic',
        iconOnly: true,
    },
    { separator: true },
    {
        value: 'headerlevel1',
        text: 'Header Level 1',
        commandText: `${mod} ${shift} 1`,
        icon: '-lime-text-h-heading-1',
        iconOnly: true,
    },
    {
        value: 'headerlevel2',
        text: 'Header Level 2',
        commandText: `${mod} ${shift} 2`,
        icon: '-lime-text-h-heading-2',
        iconOnly: true,
    },
    {
        value: 'headerlevel3',
        text: 'Header Level 3',
        commandText: `${mod} ${shift} 3`,
        icon: '-lime-text-h-heading-3',
        iconOnly: true,
    },
    { separator: true },
    {
        value: 'bullet_list',
        text: 'Bullet list',
        icon: '-lime-text-bulleted-list',
        iconOnly: true,
    },
    {
        value: 'ordered_list',
        text: 'Numbered list',
        icon: '-lime-text-ordered-list',
        iconOnly: true,
    },
    {
        value: 'blockquote',
        text: 'Blockquote',
        icon: '-lime-text-blockquote',
        iconOnly: true,
    },
];
