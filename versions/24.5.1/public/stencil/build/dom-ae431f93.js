/**
 * Check if an element is a descendant of another, even if it is located within a shadow root
 *
 * @param {Node} element the element to check
 * @param {Node} parent the parent element
 *
 * @returns {boolean} true if the element is a descendant of the parent element, false otherwise
 */
function isDescendant(element, parent) {
    if (parent.contains(element)) {
        return true;
    }
    let currentNode = element;
    let i = 0; // Just in case something weird happens, let's not crash the browser…
    const DEPTH = 1000; // Max depth to search.
    while (i < DEPTH &&
        currentNode &&
        currentNode.getRootNode().nodeName === '#document-fragment') {
        currentNode = currentNode.getRootNode().host;
        if (parent.contains(currentNode)) {
            return true;
        }
        i += 1;
    }
    return parent.contains(currentNode);
}

export { isDescendant as i };
