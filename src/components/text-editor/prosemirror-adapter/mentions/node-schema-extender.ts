import { NodeSpec } from 'prosemirror-model';

export const mention: NodeSpec = {
    inline: true,
    group: 'inline',
    selectable: true,
    atom: true,

    attrs: {
        type: {},
        id: {},
        name: {},
    },

    toDOM: (node) => [
        'span',
        {
            class: 'mention',
            style: 'color: blue',
            'data-mention-name': node.attrs.name,
            'data-mention-type': node.attrs.type,
            'data-mention-id': node.attrs.id,
        },
        '@' + node.attrs.name,
    ],
    parseDOM: [
        {
            tag: 'span[data-mention-type][data-mention-id][data-mention-name]',
            getAttrs: (dom) => ({
                name: dom.getAttribute('data-mention-name'),
                type: dom.getAttribute('data-mention-type'),
                id: dom.getAttribute('data-mention-id'),
            }),
        },
    ],
};
