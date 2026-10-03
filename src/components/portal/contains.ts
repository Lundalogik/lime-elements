/**
 * Check if an element is a descendant of another
 *
 * If the child element is a descendant of a limel-portal, this function will
 * go back through the portal and check the original tree recursively
 *
 * @param element - the parent element
 * @param child - the child element to check
 * @returns `true` if child is a descendant of element, taking
 * portals into account
 */
export function portalContains(
    element: HTMLElement,
    child: HTMLElement
): boolean {
    let current = child;
    do {
        if (
            element.contains(current) ||
            element.shadowRoot?.contains(current)
        ) {
            return true;
        }

        current = findParent(current);
    } while (current);

    return false;
}

function findParent(element: HTMLElement) {
    const portal: any = element.closest('.limel-portal--container');
    if (portal) {
        return portal.portalSource;
    }

    const rootNode = element.getRootNode() as ShadowRoot;

    return rootNode.host;
}
