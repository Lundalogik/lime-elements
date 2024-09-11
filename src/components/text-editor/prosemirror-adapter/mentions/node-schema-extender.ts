import { NodeSpec } from 'prosemirror-model';

export const mention: NodeSpec = {
    inline: true,
    group: 'inline',
    selectable: true,
    atom: false,

    attrs: {
        type: {},
        objectid: {},
        descriptive: {},
    },

    toDOM: (node) => [
        'limebb-mention',
        {
            type: node.attrs.type,
            objectid: node.attrs.objectid,
            descriptive: node.attrs.descriptive,
        },
    ],
    parseDOM: [
        {
            tag: 'limebb-mention[type][objectid]',
            getAttrs: (dom) => ({
                type: dom.getAttribute('type'),
                objectid: dom.getAttribute('objectid'),
                descriptive: dom.getAttribute('descriptive'),
            }),
        },
    ],
};
