/**
 *
 * @param id
 * @param startingPoint
 */
export function getOwnerElement(
    id: string,
    startingPoint: Node
): HTMLElement | undefined {
    let element: Node = startingPoint;

    do {
        element = element.parentNode;
    } while (
        element &&
        element.nodeType !== Node.DOCUMENT_FRAGMENT_NODE &&
        element.nodeType !== Node.DOCUMENT_NODE
    );

    return (element as ShadowRoot)?.getElementById(id);
}
