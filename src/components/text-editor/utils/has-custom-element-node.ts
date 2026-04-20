import { Node } from 'prosemirror-model';
import { CustomElementDefinition } from '../../../interface';

/**
 * Recursively checks if a ProseMirror node or
 * any of its child nodes is a registered custom element node.
 * @param node - the ProseMirror node to check
 * @param customElements - the registered custom element definitions
 */
export function hasCustomElementNode(
    node: Node,
    customElements: CustomElementDefinition[]
): boolean {
    const tagNames = new Set(customElements.map((ce) => ce.tagName));

    return hasNodeWithType(node, tagNames);
}

function hasNodeWithType(node: Node, tagNames: Set<string>): boolean {
    if (tagNames.has(node.type.name)) {
        return true;
    }

    for (let i = 0; i < node.childCount; i++) {
        if (hasNodeWithType(node.child(i), tagNames)) {
            return true;
        }
    }

    return false;
}
