/**
 * Utility functions for handling anchor link scrolling in shadow DOM components.
 */
/**
 * Get the current route from the URL hash (without the leading #).
 *
 * For hash-based routing where the entire hash is the route.
 * Example: "#/component/limel-button/examples/" → "/component/limel-button/examples/"
 */
export function getRoute() {
    return window.location.hash.substring(1);
}
/**
 * Extract the anchor ID from the current URL hash.
 *
 * Handles both simple anchors (#section) and route-based anchors (#/guide/page#section).
 * Returns null if no valid anchor is found.
 *
 * Example: "#/guide/changelog#v2-features" → "v2-features"
 */
export function getAnchorId() {
    const hash = window.location.hash;
    if (!hash) {
        return null;
    }
    // Match the last #fragment in the hash
    // This handles both "#section" and "#/route/path#section"
    const anchorMatch = hash.match(/#([^#]+)$/);
    return anchorMatch ? anchorMatch[1] : null;
}
/**
 * Scroll to an anchor element within a shadow root.
 *
 * Uses requestAnimationFrame to ensure the DOM is ready before scrolling.
 *
 * @param shadowRoot - The shadow root to search for the element
 * @param behavior - Scroll behavior ('auto' or 'smooth')
 */
export function scrollToAnchor(shadowRoot, behavior = 'auto') {
    const anchorId = getAnchorId();
    if (!anchorId) {
        return;
    }
    requestAnimationFrame(() => {
        scrollToElement(shadowRoot, anchorId, behavior);
    });
}
/**
 * Scroll to a specific element by ID within a shadow root.
 *
 * @param shadowRoot - The shadow root to search for the element
 * @param id - The element ID to scroll to
 * @param behavior - Scroll behavior ('auto' or 'smooth')
 */
export function scrollToElement(shadowRoot, id, behavior = 'auto') {
    const element = shadowRoot.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior });
    }
}
//# sourceMappingURL=anchor-scroll.js.map
