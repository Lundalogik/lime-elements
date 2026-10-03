import { DOMParser, Node } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';

/**
 * Builds a transaction that sets the named region's content, leaving every
 * other part of the document untouched. When the document has no such
 * region yet, one is appended.
 *
 * The content is parsed into the region, so the caller keeps ownership of
 * sanitizing it first.
 *
 * @param state - the state the transaction is built against
 * @param name - the region to replace
 * @param html - the region's new content
 * @returns a transaction replacing the region
 */
export function createReplaceRegionTransaction(
    state: EditorState,
    name: string,
    html: string
): Transaction {
    const region = parseRegion(state, name, html);
    const existing = findRegion(state, name);

    if (existing) {
        return state.tr.replaceWith(
            existing.pos,
            existing.pos + existing.node.nodeSize,
            region
        );
    }

    return state.tr.insert(state.doc.content.size, region);
}

function parseRegion(state: EditorState, name: string, html: string): Node {
    const container = document.createElement('div');
    container.innerHTML = html;

    return DOMParser.fromSchema(state.schema).parse(container, {
        topNode: state.schema.nodes.region.createAndFill({ name: name }),
    });
}

function findRegion(
    state: EditorState,
    name: string
): { pos: number; node: Node } | undefined {
    const type = state.schema.nodes.region;
    let pos = 0;

    for (let index = 0; index < state.doc.childCount; index++) {
        const node = state.doc.child(index);
        if (node.type === type && node.attrs.name === name) {
            return { pos: pos, node: node };
        }

        pos += node.nodeSize;
    }

    return undefined;
}
