export function isParent(node) {
    return 'children' in node;
}
export function isTextNode(node) {
    return node.type === 'text';
}
export function isElement(node) {
    return node.type === 'element' && 'tagName' in node;
}
