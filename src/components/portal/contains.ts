/**
 * Check if an element is a descendant of another
 *
 * If the child element is a descendant of a limel-portal, this function will
 * go back through the portal and check the original tree recursively
 *
 * @param {HTMLElement} element the parent element
 * @param {HTMLElement} child the child element to check
 *
 * @returns {boolean} `true` if child is a descendant of element, taking
 * portals into account
 */
export function portalContains(
    element: HTMLElement,
    child: HTMLElement
): boolean {
    if (element.contains(child) || element.shadowRoot?.contains(child)) {
        return true;
    }

    const parent = findParent(child);
    if (!parent) {
        return false;
    }

    return portalContains(element, parent);
}

function findParent(element: HTMLElement) {
    const portal: any = element.closest('.limel-portal--container');
    if (portal) {
        return portal.portalSource;
    }

    const rootNode = element.getRootNode() as ShadowRoot;

    return rootNode.host;
}
