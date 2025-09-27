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

export const highlight: MarkSpec = {
    parseDOM: [
        { tag: 'mark' },
        { tag: 'span[style*="background-color"]' },
        { style: 'background-color' },
    ],
    toDOM: () => {
        return ['mark', { class: 'lime-text-highlight' }, 0];
    },
};
