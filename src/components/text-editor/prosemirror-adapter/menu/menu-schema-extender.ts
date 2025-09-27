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
    attrs: {
        color: { default: 'yellowgreen' },
    },
    parseDOM: [
        {
            tag: 'mark',
            getAttrs: (dom) => ({
                color:
                    (dom as HTMLElement).style.backgroundColor || 'yellowgreen',
            }),
        },
        {
            tag: 'span[style*="background-color"]',
            getAttrs: (dom) => ({
                color:
                    (dom as HTMLElement).style.backgroundColor || 'yellowgreen',
            }),
        },
    ],
    toDOM: (node) => {
        return [
            'mark',
            {
                class: 'lime-text-highlight',
                style: `background-color: ${node.attrs.color}`,
            },
            0,
        ];
    },
};
