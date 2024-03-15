import { toggleMark, setBlockType, wrapIn } from 'prosemirror-commands';
import { schema } from 'prosemirror-schema-basic';
import { TextEditorMenuButton, TextEditorMenuItems } from '../menu/types';

function getHeadingItem(level: number): TextEditorMenuButton {
    return {
        id: 'limel-text-editor-heading' + level,
        command: setBlockType(schema.nodes.heading, { level: level }),
        title: `H${level}`,
    };
}

export const defaultTextEditorMenu: TextEditorMenuItems = [
    {
        id: 'limel-text-editor-bold',
        command: toggleMark(schema.marks.strong),
        title: 'B',
    },
    {
        id: 'limel-text-editor-italic',
        command: toggleMark(schema.marks.em),
        title: 'i',
    },
    {
        id: 'limel-text-editor-paragraph',
        command: setBlockType(schema.nodes.paragraph),
        title: 'p',
    },
    getHeadingItem(1),
    // eslint-disable-next-line no-magic-numbers
    getHeadingItem(2),
    // eslint-disable-next-line no-magic-numbers
    getHeadingItem(3),
    {
        id: 'limel-text-editor-blockquote',
        command: wrapIn(schema.nodes.blockquote),
        title: '>',
    },
];
