import type { Node } from 'unist';
import { isElement, isParent, isTextNode } from './markdown-nodes';

type MapFn = (node: Node, index: number, parent: Node | null) => Node[];

export function typeLinks(
    options: { types?: string[] } = {},
): (tree: Node) => Node {
    return transformer(options.types);
}

const transformer =
    (types: string[] = []) =>
    (tree: Node): Node => {
        if (types.length === 0) {
            return tree;
        }

        const preCodeElements = collectPreCodeElements(tree);

        return flatMap(tree, mapCodeNode(types, preCodeElements));
    };

function collectPreCodeElements(node: Node): Set<Node> {
    const set = new Set<Node>();
    collectPreCode(node, set);

    return set;
}

function collectPreCode(node: Node, set: Set<Node>) {
    if (!isParent(node)) {
        return;
    }

    if (isElement(node) && node.tagName === 'pre') {
        for (const child of node.children) {
            if (isElement(child) && child.tagName === 'code') {
                set.add(child);
            }
        }
    }

    for (const child of node.children) {
        collectPreCode(child, set);
    }
}

const mapCodeNode =
    (types: string[] = [], preCodeElements: Set<Node>) =>
    (node: Node, _: number, parent: Node | null) => {
        if (!isTextNode(node)) {
            return [node];
        }

        if (!parent || !isElement(parent)) {
            return [node];
        }

        if (parent.tagName !== 'code') {
            return [node];
        }

        if (preCodeElements.has(parent)) {
            return [node];
        }

        return wrapText(node, types);
    };

export function wrapText(node: { value: string }, types: string[] = []) {
    return splitTypeString(node.value).map(createNode(types));
}

const createNode =
    (types: string[] = []) =>
    (type: string) => {
        if (!types.includes(type)) {
            return createTextNode(type);
        }

        return createLinkNode(type);
    };

function createTextNode(text: string) {
    return {
        type: 'text',
        value: text,
    };
}

function createLinkNode(type: string) {
    return {
        type: 'element',
        tagName: 'a',
        properties: {
            href: `#/type/${type}`,
        },
        children: [
            {
                type: 'text',
                value: type,
            },
        ],
    };
}

export function splitTypeString(typeString: string): string[] {
    const pattern = /(\b\w+\b)+/g;
    const types = typeString.match(pattern);
    const result: string[] = [];

    if (!types) {
        return [typeString];
    }

    let currentString = typeString;
    types.forEach((type: string) => {
        const index = currentString.indexOf(type);
        if (index > 0) {
            result.push(currentString.substring(0, index));
        }

        result.push(type);
        currentString = currentString.substring(index + type.length);
    });

    if (currentString.length > 0) {
        result.push(currentString);
    }

    return result;
}

function transformChildren(node: Node, fn: MapFn) {
    if (!isParent(node)) {
        return;
    }

    node.children = node.children.flatMap((child, i) =>
        transform(child, i, node, fn),
    );
}

function transform(
    node: Node,
    index: number,
    parent: Node | null,
    fn: MapFn,
): Node[] {
    transformChildren(node, fn);

    return fn(node, index, parent);
}

function flatMap(ast: Node, fn: MapFn): Node {
    const result = transform(ast, 0, null, fn);

    if (result.length !== 1) {
        throw new Error(
            `flatMap: root must map to exactly one node, got ${result.length}`,
        );
    }

    return result[0];
}
