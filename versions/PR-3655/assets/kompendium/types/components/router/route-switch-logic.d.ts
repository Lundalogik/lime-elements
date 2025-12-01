/**
 * Interface for accessing route element properties
 * Used for type-safe sibling route checking
 */
export interface RouteElement extends Element {
    url?: string;
}
/**
 * Type guard to check if an element is a route element
 * @param {Element} element - The element to check
 * @returns {boolean} True if the element is a kompendium-route
 */
export declare function isRouteElement(element: Element): element is RouteElement;
/**
 * Check if any previous sibling route matches the current path
 * Used by route-switch to implement first-match-wins behavior
 * @param {HTMLElement} currentElement - The current route element
 * @param {string} currentPath - The current path to match
 * @returns {boolean} True if a previous sibling route matches
 */
export declare function hasPreviousMatchingSibling(currentElement: HTMLElement, currentPath: string): boolean;
