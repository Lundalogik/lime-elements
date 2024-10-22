import { NodeSpec } from 'prosemirror-model';
import { CustomElement } from '../../../global/shared-types/custom-element.types';

type NodeSpecFactory = (config: CustomElement) => NodeSpec;

export const createNodeSpec: NodeSpecFactory = (
    config: CustomElement,
): NodeSpec => {
    const attributes = config.attributes.reduce((acc, attr) => {
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
            config.attributes.reduce((acc, attr) => {
                acc[attr] = node.attrs[attr];

                return acc;
            }, {}),
        ],
        parseDOM: [
            {
                tag: `${config.tagName}[${config.attributes.map((attr) => attr).join('][')}]`,
                getAttrs: (dom: Element) =>
                    config.attributes.reduce((acc, attr) => {
                        acc[attr] = dom.getAttribute(attr);

                        return acc;
                    }, {}),
            },
        ],
    };
};
