import { matchRoute } from "./route-matching";
/**
 * Type guard to check if an element is a route element
 * @param {Element} element - The element to check
 * @returns {boolean} True if the element is a kompendium-route
 */
export function isRouteElement(element) {
    return element.tagName.toLowerCase() === 'kompendium-route';
}
/**
 * Check if any previous sibling route matches the current path
 * Used by route-switch to implement first-match-wins behavior
 * @param {HTMLElement} currentElement - The current route element
 * @param {string} currentPath - The current path to match
 * @returns {boolean} True if a previous sibling route matches
 */
export function hasPreviousMatchingSibling(currentElement, currentPath) {
    const parent = currentElement.parentElement;
    if ((parent === null || parent === void 0 ? void 0 : parent.tagName.toLowerCase()) !== 'kompendium-route-switch') {
        return false;
    }
    const siblings = Array.from(parent.children);
    const myIndex = siblings.indexOf(currentElement);
    // Check all previous siblings
    for (let i = 0; i < myIndex; i++) {
        const sibling = siblings[i];
        // Use type guard to ensure element has expected route properties
        if (!isRouteElement(sibling)) {
            continue;
        }
        // Access sibling's URL property with type safety
        const siblingUrl = sibling.url;
        // Check if sibling matches current path
        let siblingMatch;
        if (siblingUrl) {
            siblingMatch = matchRoute(currentPath, siblingUrl);
        }
        else {
            siblingMatch = { params: {} }; // Routes without URL are catch-all
        }
        if (siblingMatch) {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=route-switch-logic.js.map
