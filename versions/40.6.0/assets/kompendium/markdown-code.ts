import type { Node } from 'unist';
import { map } from 'unist-util-map';
import { isElement } from './markdown-nodes';

export function kompendiumCode(): (tree: Node) => Node {
    return transformer;
}

function transformer(tree: Node) {
    return map(tree, mapCodeNode);
}

function mapCodeNode(node: Node) {
    if (!isElement(node)) {
        return node;
    }

    if (node.tagName !== 'code') {
        return node;
    }

    const language = getLanguage(node.properties);
    if (!language) {
        return node;
    }

    return {
        ...node,
        type: 'element',
        tagName: 'kompendium-code',
        properties: {
            language: language,
        },
    };
}

function getLanguage(props?: Record<string, unknown>) {
    const className = props?.className;
    if (!Array.isArray(className)) {
        return;
    }

    const languageClass = className.find((name: string) =>
        name.startsWith('language-'),
    );
    if (!languageClass) {
        return;
    }

    return languageClass.replace('language-', '');
}
