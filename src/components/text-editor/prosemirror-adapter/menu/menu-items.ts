import { ActionBarItem } from 'src/components/action-bar/action-bar.types';
import { ListSeparator } from 'src/components/list/list-item.types';
import { EditorMenuTypes } from './types';
import { cloneDeep } from 'lodash-es';

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

const textEditorMenuItems: Array<
    ActionBarItem<EditorMenuTypes> | ListSeparator
> = [
    {
        value: EditorMenuTypes.Bold,
        text: 'Bold',
        commandText: `${mod} B`,
        icon: '-lime-text-bold',
        iconOnly: true,
        selected: false,
    },
    {
        value: EditorMenuTypes.Italic,
        text: 'Italic',
        commandText: `${mod} I`,
        icon: '-lime-text-italic',
        iconOnly: true,
        selected: false,
    },
    {
        value: EditorMenuTypes.Underline,
        text: 'Underline',
        commandText: `${mod} U`,
        icon: '-lime-text-underline',
        iconOnly: true,
        selected: false,
    },
    {
        value: EditorMenuTypes.Strikethrough,
        text: 'Strikethrough',
        commandText: `${mod} ${shift} X`,
        icon: '-lime-text-strikethrough',
        iconOnly: true,
        selected: false,
    },
    {
        value: EditorMenuTypes.Code,
        text: 'Code',
        commandText: `${mod} \``,
        icon: '-lime-text-code',
        iconOnly: true,
        selected: false,
    },
    {
        value: EditorMenuTypes.CodeBlock,
        text: 'Code Block',
        commandText: `${mod} ${shift} C`,
        icon: '-lime-text-code-block',
        iconOnly: true,
        selected: false,
    },
    { separator: true },
    {
        value: EditorMenuTypes.HeaderLevel1,
        text: 'Header 1',
        commandText: `${mod} ${shift} 1`,
        icon: '-lime-text-h-heading-1',
        iconOnly: true,
        selected: false,
    },
    {
        value: EditorMenuTypes.HeaderLevel2,
        text: 'Header 2',
        commandText: `${mod} ${shift} 2`,
        icon: '-lime-text-h-heading-2',
        iconOnly: true,
        selected: false,
    },
    {
        value: EditorMenuTypes.HeaderLevel3,
        text: 'Header 3',
        commandText: `${mod} ${shift} 3`,
        icon: '-lime-text-h-heading-3',
        iconOnly: true,
        selected: false,
    },
    { separator: true },
    {
        value: EditorMenuTypes.BulletList,
        text: 'Bullet list',
        icon: '-lime-text-bulleted-list',
        iconOnly: true,
        selected: false,
    },
    {
        value: EditorMenuTypes.OrderedList,
        text: 'Numbered list',
        icon: '-lime-text-ordered-list',
        iconOnly: true,
        selected: false,
    },
    {
        value: EditorMenuTypes.Blockquote,
        text: 'Blockquote',
        icon: '-lime-text-blockquote',
        iconOnly: true,
        selected: false,
    },
];

export const getTextEditorMenuItems = () => cloneDeep(textEditorMenuItems);

export const menuTranslationIDs = {
    strong: 'editor-menu.bold',
    em: 'editor-menu.italic',
    headerlevel1: 'editor-menu.h1',
    headerlevel2: 'editor-menu.h2',
    headerlevel3: 'editor-menu.h3',
    /* eslint-disable camelcase */
    bullet_list: 'editor-menu.bulleted-list',
    ordered_list: 'editor-menu.numbered-list',
    code_block: 'editor-menu.code-block',
    /* eslint-enable camelcase */
    blockquote: 'editor-menu.blockquote',
    link: 'editor-menu.link',
    underline: 'editor-menu.underline',
    strikethrough: 'editor-menu.strikethrough',
    code: 'editor-menu.code',
};

export type menuTranslationIDs =
    (typeof menuTranslationIDs)[keyof typeof menuTranslationIDs];
