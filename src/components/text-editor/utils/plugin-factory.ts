import {
    AttributeSpec,
    Attrs,
    DOMOutputSpec,
    NodeSpec,
} from 'prosemirror-model';
import { CustomElementDefinition } from '../../../global/shared-types/custom-element.types';

type NodeSpecFactory = (config: CustomElementDefinition) => NodeSpec;
type AttributeSpecs = {
    [name: string]: AttributeSpec;
};
type MutableAttrs = {
    [attr: string]: any;
};

export const createNodeSpec: NodeSpecFactory = (
    config: CustomElementDefinition
): NodeSpec => {
    const attributeSpecs: AttributeSpecs = {};
    for (const attribute of config.attributes) attributeSpecs[attribute] = {};

    const tag = `${config.tagName}[${config.attributes.map((attr) => attr).join('][')}]`;

    return {
        group: 'inline',
        content: '(text* | inline*)',
        inline: true,
        atom: true,
        selectable: true,
        attrs: attributeSpecs,

        toDOM: (node): DOMOutputSpec => [config.tagName, node.attrs],
        parseDOM: [
            {
                tag: tag,
                getAttrs: (dom: Element): Attrs => {
                    const attributes: MutableAttrs = {};
                    // eslint-disable-next-line unicorn/no-array-for-each
                    config.attributes.forEach(
                        (attribute: string) =>
                            (attributes[attribute] =
                                dom.getAttribute(attribute))
                    );

                    return attributes as Attrs;
                },
            },
        ],
    };
};
