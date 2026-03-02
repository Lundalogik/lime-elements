/**
 * Utility functions for handling anchor link scrolling in shadow DOM components.
 */
/**
 * Get the current route from the URL hash (without the leading #).
 *
 * For hash-based routing where the entire hash is the route.
 * Example: "#/component/limel-button/examples/" → "/component/limel-button/examples/"
 * @returns {string} The route extracted from the URL hash
 */
export declare function getRoute(): string;
/**
 * Extract the anchor ID from the current URL hash.
 *
 * Handles both simple anchors (#section) and route-based anchors (#/guide/page#section).
 * Returns null if no valid anchor is found.
 *
 * Example: "#/guide/changelog#v2-features" → "v2-features"
 * @returns {string | null} The anchor ID or null if not found
 */
export declare function getAnchorId(): string | null;
/**
 * Scroll to an anchor element within a shadow root.
 *
 * Uses requestAnimationFrame to ensure the DOM is ready before scrolling.
 * @param {ShadowRoot} shadowRoot - The shadow root to search for the element
 * @param {ScrollBehavior} behavior - Scroll behavior ('auto' or 'smooth')
 */
export declare function scrollToAnchor(shadowRoot: ShadowRoot, behavior?: ScrollBehavior): void;
/**
 * Scroll to a specific element by ID within a shadow root.
 * @param {ShadowRoot} shadowRoot - The shadow root to search for the element
 * @param {string} id - The element ID to scroll to
 * @param {ScrollBehavior} behavior - Scroll behavior ('auto' or 'smooth')
 */
export declare function scrollToElement(shadowRoot: ShadowRoot, id: string, behavior?: ScrollBehavior): void;
