import { ResolvedPos, NodeType } from 'prosemirror-model';

/**
 * Finds the depth of the nearest ancestor of a given node type.
 *
 * @param $pos - The resolved position in the document.
 * @param type - The node type to search for.
 * @returns The depth at which the node is found, or null if not found.
 */
export const findAncestorDepthOfType = (
    $pos: ResolvedPos,
    type: NodeType,
): number | null => {
    for (let depth = $pos.depth; depth > 0; depth--) {
        if ($pos.node(depth).type === type) {
            return depth;
        }
    }

    return null;
};
