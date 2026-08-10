import type { Node, Parent } from 'unist';
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

        const skipCodeElements = collectSkippableCodeElements(tree);

        return flatMap(tree, mapCodeNode(types, skipCodeElements));
    };

function collectSkippableCodeElements(node: Node): Set<Node> {
    const set = new Set<Node>();
    collectSkippableCode(node, set, false);

    return set;
}

function collectSkippableCode(
    node: Node,
    set: Set<Node>,
    insideAnchor: boolean,
) {
    if (!isParent(node)) {
        return;
    }

    const tagName = isElement(node) ? node.tagName : '';

    // Skip `<code>` nested inside an `<a>`: the inline-link pass (`inlineLinks`
    // in markdown-inline-links.ts) emits exactly this `link > inlineCode` shape
    // for a resolved bare `{@link}` reference. Re-linking that code here would
    // wrap an anchor in another anchor, so this pass yields to the earlier one.
    // This guard is intentionally broader than that contract: it suppresses
    // re-linking for *any* `<code>` inside *any* `<a>`, regardless of origin,
    // since a nested anchor is never wanted no matter how the `<code>` got
    // there.
    if (tagName === 'code' && insideAnchor) {
        set.add(node);
    }

    if (tagName === 'pre') {
        addPreCodeChildren(node, set);
    }

    const nextInsideAnchor = insideAnchor || tagName === 'a';
    for (const child of node.children) {
        collectSkippableCode(child, set, nextInsideAnchor);
    }
}

function addPreCodeChildren(node: Parent, set: Set<Node>) {
    for (const child of node.children) {
        if (isElement(child) && child.tagName === 'code') {
            set.add(child);
        }
    }
}

const mapCodeNode =
    (types: string[] = [], skipCodeElements: Set<Node>) =>
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

        if (skipCodeElements.has(parent)) {
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
