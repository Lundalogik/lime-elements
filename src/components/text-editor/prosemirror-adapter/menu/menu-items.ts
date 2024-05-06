import { ActionBarItem } from 'src/components/action-bar/action-bar.types';
import { ListSeparator } from 'src/components/list/list-item.types';
import { EditorMenuTypes } from './types';

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

export const textEditorMenuItems: Array<
    ActionBarItem<EditorMenuTypes> | ListSeparator
> = [
    {
        value: EditorMenuTypes.Strong,
        text: 'Bold',
        commandText: `${mod} B`,
        icon: '-lime-text-bold',
        iconOnly: true,
    },
    {
        value: EditorMenuTypes.Italic,
        text: 'Italic',
        commandText: `${mod} I`,
        icon: '-lime-text-italic',
        iconOnly: true,
    },
    { separator: true },
    {
        value: EditorMenuTypes.HeaderLevel1,
        text: 'Header Level 1',
        commandText: `${mod} ${shift} 1`,
        icon: '-lime-text-h-heading-1',
        iconOnly: true,
    },
    {
        value: EditorMenuTypes.HeaderLevel2,
        text: 'Header Level 2',
        commandText: `${mod} ${shift} 2`,
        icon: '-lime-text-h-heading-2',
        iconOnly: true,
    },
    {
        value: EditorMenuTypes.HeaderLevel3,
        text: 'Header Level 3',
        commandText: `${mod} ${shift} 3`,
        icon: '-lime-text-h-heading-3',
        iconOnly: true,
    },
    { separator: true },
    {
        value: EditorMenuTypes.BulletList,
        text: 'Bullet list',
        icon: '-lime-text-bulleted-list',
        iconOnly: true,
    },
    {
        value: EditorMenuTypes.OrderedList,
        text: 'Numbered list',
        icon: '-lime-text-ordered-list',
        iconOnly: true,
    },
    {
        value: EditorMenuTypes.Blockquote,
        text: 'Blockquote',
        icon: '-lime-text-blockquote',
        iconOnly: true,
    },
];
