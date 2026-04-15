import type { Node, Parent } from 'unist';
export interface ElementNode extends Parent {
    tagName: string;
    properties?: Record<string, unknown>;
}
export interface TextNode extends Node {
    type: 'text';
    value: string;
}
export declare function isParent(node: Node): node is Parent;
export declare function isTextNode(node: Node): node is TextNode;
export declare function isElement(node: Node): node is ElementNode;
