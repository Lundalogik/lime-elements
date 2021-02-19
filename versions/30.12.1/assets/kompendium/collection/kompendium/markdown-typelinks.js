import flatMap from 'unist-util-flatmap';
export function typeLinks(options = {}) {
    return transformer(options.types);
}
const transformer = (types = []) => (tree) => {
    if (types.length === 0) {
        return tree;
    }
    return flatMap(tree, mapCodeNode(types));
};
const mapCodeNode = (types = []) => (node, _, parent) => {
    var _a;
    if (node.type !== 'text') {
        return [node];
    }
    if (parent.tagName !== 'code') {
        return [node];
    }
    if (((_a = parent.parent) === null || _a === void 0 ? void 0 : _a.tagName) === 'pre') {
        return [node];
    }
    return wrapText(node, types);
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
    let currentString = typeString;
    types.forEach((type) => {
        const index = currentString.indexOf(type);
        if (index > 0) {
            result.push(currentString.substr(0, index));
        }
        result.push(type);
        currentString = currentString.substr(index + type.length);
    });
    if (currentString.length > 0) {
        result.push(currentString);
    }
    return result;
}
