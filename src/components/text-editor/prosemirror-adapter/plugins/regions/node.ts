import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';
import { EditorRegion } from '../../../text-editor.types';

/**
 * Attribute a region is marked with in the editor's HTML.
 */
export const REGION_ATTRIBUTE = 'data-lime-region';

/**
 * Builds the node spec for regions: named block-level areas of the document
 * that keep their identity through a parse and serialize round trip, so a
 * consumer can address one after the content has been through the editor.
 *
 * A region is a plain div carrying a marker attribute rather than a custom
 * element, so the serialized value stays ordinary HTML wherever it is sent
 * on to.
 *
 * @param regions - the regions the consumer has declared
 */
export function getRegionNodes(
    regions: EditorRegion[]
): Record<string, NodeSpec> {
    return { region: createRegionNodeSpec(regions) };
}

function createRegionNodeSpec(regions: EditorRegion[]): NodeSpec {
    const declared = new Set(regions.map((region) => region.name));

    return {
        group: 'block',
        content: 'block+',
        defining: true,
        attrs: { name: {} },
        toDOM: (node): DOMOutputSpec => [
            'div',
            { [REGION_ATTRIBUTE]: node.attrs.name },
            0,
        ],
        parseDOM: [
            {
                tag: `div[${REGION_ATTRIBUTE}]`,
                getAttrs: (dom: HTMLElement) => {
                    const name = dom.getAttribute(REGION_ATTRIBUTE);

                    // An undeclared name is ordinary content: a consumer only
                    // owns the regions it asked for.
                    return declared.has(name) ? { name: name } : false;
                },
            },
        ],
    };
}
