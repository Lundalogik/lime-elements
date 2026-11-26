import type { Node, Parent } from 'unist';

export interface ElementNode extends Parent {
    tagName: string;
    properties?: Record<string, unknown>;
}

export interface TextNode extends Node {
    type: 'text';
    value: string;
}

export function isParent(node: Node): node is Parent {
    return 'children' in node;
}

export function isTextNode(node: Node): node is TextNode {
    return node.type === 'text';
}

export function isElement(node: Node): node is ElementNode {
    return node.type === 'element' && 'tagName' in node;
}
