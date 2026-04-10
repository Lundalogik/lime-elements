import morphdom from 'morphdom';

/**
 * Morph the children of `container` to match the given HTML string.
 *
 * Uses morphdom to diff the existing DOM against the new HTML and apply
 * only the minimum changes. This preserves existing DOM nodes (including
 * custom elements with internal state) that haven't changed.
 *
 * @param container - The parent element whose children should be morphed.
 * @param html - The new HTML content for the container's children.
 */
export function morphChildren(container: HTMLElement, html: string = ''): void {
    // morphdom's second argument must be a single root element. We wrap
    // the new HTML in a <div> purely to satisfy that requirement — the
    // tag name doesn't matter because childrenOnly makes morphdom skip
    // the root and only diff the children. The container element itself
    // is never compared or replaced, so it can be any element type.
    try {
        morphdom(container, `<div>${html}</div>`, {
            childrenOnly: true,
        });
    } catch (error) {
        // Fall back to innerHTML so that content is at least visible,
        // even though custom elements will be destroyed and recreated.
        console.warn('morphdom failed, falling back to innerHTML:', error);
        container.innerHTML = html;
    }
}
