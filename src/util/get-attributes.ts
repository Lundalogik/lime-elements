/**
 * Some attributes are randomly generated and we do not have access to them as they
 * are generated e.g., inside the breadcrumbs component. But we can get them this way.
 * Retrieves such attributes as ids via inorder traversal
 *
 * Useful for testing
 *
 * @param node - base node
 * @param attributes - array that you wish to populate that contains the found attributes
 * @param attribute - the name of the type of attribute you are looking for
 *
 * @internal
 */
export function getAttributesRecursively(
    node: Element,
    attributes: string[],
    attribute: string = 'id'
) {
    if (node.children && node.getAttribute(attribute)) {
        attributes.push(node.getAttribute(attribute));
    }

    if (node.shadowRoot) {
        for (const child of node.shadowRoot.children) {
            getAttributesRecursively(child, attributes, attribute);
        }
    }

    for (const child of node.children) {
        getAttributesRecursively(child, attributes, attribute);
    }
}
