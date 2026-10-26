import type { Node } from 'unist';
export declare function typeLinks(options?: {
    types?: string[];
}): (tree: Node) => Node;
export declare function wrapText(node: {
    value: string;
}, types?: string[]): ({
    type: string;
    value: string;
} | {
    type: string;
    tagName: string;
    properties: {
        href: string;
    };
    children: {
        type: string;
        value: string;
    }[];
})[];
export declare function splitTypeString(typeString: string): string[];
