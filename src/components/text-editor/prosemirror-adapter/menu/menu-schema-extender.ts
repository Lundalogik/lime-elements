import { MarkSpec } from 'prosemirror-model';

export const strikethrough: MarkSpec = {
    parseDOM: [
        { tag: 's' },
        { tag: 'del' },
        { tag: 'strike' },
        { style: 'text-decoration=line-through' },
    ],
    toDOM: () => {
        return ['s', 0];
    },
};
