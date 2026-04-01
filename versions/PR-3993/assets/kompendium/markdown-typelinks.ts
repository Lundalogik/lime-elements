import flatMap from 'unist-util-flatmap';

export function typeLinks(options: any = {}): (tree) => any {
    return transformer(options.types);
}

const transformer =
    (types: string[] = []) =>
    (tree): any => {
        if (types.length === 0) {
            return tree;
        }

        return flatMap(tree, mapCodeNode(types));
    };

const mapCodeNode =
    (types: string[] = []) =>
    (node, _, parent) => {
        if (node.type !== 'text') {
            return [node];
        }

        if (parent.tagName !== 'code') {
            return [node];
        }

        if (parent.parent?.tagName === 'pre') {
            return [node];
        }

        return wrapText(node, types);
    };

export function wrapText(node: any, types: string[] = []) {
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

    let currentString = typeString;
    types.forEach((type: string) => {
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
