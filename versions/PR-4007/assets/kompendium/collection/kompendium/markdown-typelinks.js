import { isElement, isParent, isTextNode } from "./markdown-nodes";
export function typeLinks(options = {}) {
    return transformer(options.types);
}
const transformer = (types = []) => (tree) => {
    if (types.length === 0) {
        return tree;
    }
    const preCodeElements = collectPreCodeElements(tree);
    return flatMap(tree, mapCodeNode(types, preCodeElements));
};
function collectPreCodeElements(node) {
    const set = new Set();
    collectPreCode(node, set);
    return set;
}
function collectPreCode(node, set) {
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
const mapCodeNode = (types = [], preCodeElements) => (node, _, parent) => {
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
export function wrapText(node, types = []) {
    return splitTypeString(node.value).map(createNode(types));
}
const createNode = (types = []) => (type) => {
    if (!types.includes(type)) {
        return createTextNode(type);
    }
    return createLinkNode(type);
};
function createTextNode(text) {
    return {
        type: 'text',
        value: text,
    };
}
function createLinkNode(type) {
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
export function splitTypeString(typeString) {
    const pattern = /(\b\w+\b)+/g;
    const types = typeString.match(pattern);
    const result = [];
    if (!types) {
        return [typeString];
    }
    let currentString = typeString;
    types.forEach((type) => {
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
function transformChildren(node, fn) {
    if (!isParent(node)) {
        return;
    }
    node.children = node.children.flatMap((child, i) => transform(child, i, node, fn));
}
function transform(node, index, parent, fn) {
    transformChildren(node, fn);
    return fn(node, index, parent);
}
function flatMap(ast, fn) {
    const result = transform(ast, 0, null, fn);
    if (result.length !== 1) {
        throw new Error(`flatMap: root must map to exactly one node, got ${result.length}`);
    }
    return result[0];
}
//# sourceMappingURL=markdown-typelinks.js.map
