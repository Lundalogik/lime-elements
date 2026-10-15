/**
 * Returns the element that has focus, also when it is inside shadow roots.
 * `document.activeElement` returns the host of the outermost shadow root that
 * contains the focused element.
 *
 * @returns the element that has focus, or `null` when no element has focus
 */
export function getDeepActiveElement(): Element | null {
    let element = document.activeElement;
    while (element?.shadowRoot?.activeElement) {
        element = element.shadowRoot.activeElement;
    }

    return element;
}
