import { MarkSpec } from 'prosemirror-model';

export const underline: MarkSpec = {
    parseDOM: [{ tag: 'u' }, { style: 'text-decoration=underline' }],
    toDOM: () => {
        return ['u', 0];
    },
};

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
