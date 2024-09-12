import { NodeSpec } from 'prosemirror-model';
import { NodeSpecFactory, NodeConfig } from '../types';

export const createNodeSpec: NodeSpecFactory = (
    config: NodeConfig,
): NodeSpec => {
    const attributes = config.attrs.reduce((acc, attr) => {
        acc[attr] = {};

        return acc;
    }, {});

    return {
        group: 'inline',
        inline: true,
        atom: false,
        selectable: true,
        attrs: attributes,

        toDOM: (node) => [
            config.tagName,
            config.attrs.reduce((acc, attr) => {
                acc[attr] = node.attrs[attr];

                return acc;
            }, {}),
        ],
        parseDOM: [
            {
                tag: `${config.tagName}[${config.attrs.map((attr) => attr).join('][')}]`,
                getAttrs: (dom: Element) =>
                    config.attrs.reduce((acc, attr) => {
                        acc[attr] = dom.getAttribute(attr);

                        return acc;
                    }, {}),
            },
        ],
    };
};
