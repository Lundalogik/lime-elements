import { NodeSpec } from 'prosemirror-model';
import { nodes as basicNodes } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import OrderedMap from 'orderedmap';
import { CustomElementDefinition } from '../../../../global/shared-types/custom-element.types';
import { createNodeSpec } from '../../utils/plugin-factory';
import { getTableNodes } from '../plugins/table-plugin';
import { getImageNode } from '../plugins/image/node';
import { Languages } from '../../../date-picker/date.types';

/**
 * Base nodes cherry-picked from prosemirror-schema-basic.
 * The basic `image` node is intentionally excluded — we use our own.
 */
const baseNodes: OrderedMap<NodeSpec> = OrderedMap.from({
    doc: basicNodes.doc,
    paragraph: basicNodes.paragraph,
    blockquote: basicNodes.blockquote,
    horizontal_rule: basicNodes.horizontal_rule,
    heading: basicNodes.heading,
    code_block: basicNodes.code_block,
    text: basicNodes.text,
    hard_break: basicNodes.hard_break,
});

/**
 * Assembles the complete node spec map for the text editor schema.
 *
 * 1. Starts with cherry-picked base nodes
 * 2. Appends custom element nodes
 * 3. Adds list nodes (ordered_list, bullet_list, list_item)
 * 4. Conditionally adds table nodes (HTML content type only)
 * 5. Appends our custom image node
 * @param options
 * @param options.customElements
 * @param options.contentType
 * @param options.language
 */
export function buildNodes(options: {
    customElements?: CustomElementDefinition[];
    contentType?: string;
    language?: Languages;
}): OrderedMap<NodeSpec> {
    const { customElements = [], contentType, language } = options;

    let nodes = baseNodes;

    for (const customElement of customElements) {
        const newNodeSpec = createNodeSpec(customElement);
        const nodeName = customElement.tagName;
        nodes = nodes.append({ [nodeName]: newNodeSpec });
    }

    nodes = addListNodes(nodes, 'paragraph block*', 'block');

    if (contentType === 'html') {
        nodes = nodes.append(getTableNodes());
    }

    nodes = nodes.append(getImageNode(language));

    return nodes;
}
