import { Plugin, Transformer } from 'unified';
import { Node } from 'unist';

export const createRemoveEmptyParagraphsPlugin = (enabled = false): Plugin => {
    return (): Transformer => {
        if (!enabled) {
            return (tree: Node) => tree;
        }

        return (tree: Node) => {
            pruneEmptyParagraphs(tree, null);

            return tree;
        };
    };
};

const NBSP_REGEX = /\u00A0/g;
const ZERO_WIDTH_HEX_CODES = ['200B', '200C', '200D', 'FEFF'];
const MEANINGFUL_VOID_ELEMENTS = new Set([
    'audio',
    'canvas',
    'embed',
    'iframe',
    'img',
    'input',
    'object',
    'svg',
    'video',
]);

const TREAT_AS_EMPTY_ELEMENTS = new Set(['br']);

const stripZeroWidthCharacters = (text: string): string => {
    let cleaned = text;

    for (const hexCode of ZERO_WIDTH_HEX_CODES) {
        const character = String.fromCodePoint(Number.parseInt(hexCode, 16));
        cleaned = cleaned.split(character).join('');
    }

    return cleaned;
};

const pruneEmptyParagraphs = (node: any, parent: any) => {
    if (!node || typeof node !== 'object') {
        return;
    }

    if (
        node.type === 'element' &&
        node.tagName === 'p' &&
        parent &&
        isParagraphEffectivelyEmpty(node) &&
        Array.isArray(parent.children)
    ) {
        const index = parent.children.indexOf(node);

        if (index !== -1) {
            parent.children.splice(index, 1);
            return;
        }
    }

    if (!Array.isArray(node.children) || node.children.length === 0) {
        return;
    }

    for (let i = node.children.length - 1; i >= 0; i--) {
        pruneEmptyParagraphs(node.children[i], node);
    }
};

const isParagraphEffectivelyEmpty = (element: any): boolean => {
    if (!Array.isArray(element.children) || element.children.length === 0) {
        return true;
    }

    return element.children.every((child: any) =>
        isNodeEffectivelyEmpty(child)
    );
};

const isNodeEffectivelyEmpty = (node: any): boolean => {
    if (!node) {
        return true;
    }

    if (node.type === 'text') {
        return isWhitespace(typeof node.value === 'string' ? node.value : '');
    }

    if (node.type === 'comment') {
        return true;
    }

    if (node.type === 'element') {
        const element = node;
        const tagName = element.tagName;

        if (typeof tagName !== 'string') {
            return true;
        }

        if (MEANINGFUL_VOID_ELEMENTS.has(tagName)) {
            return false;
        }

        if (TREAT_AS_EMPTY_ELEMENTS.has(tagName)) {
            return true;
        }

        if (!Array.isArray(element.children) || element.children.length === 0) {
            return true;
        }

        return element.children.every((child: any) =>
            isNodeEffectivelyEmpty(child)
        );
    }

    return true;
};

const isWhitespace = (value: string): boolean => {
    if (!value) {
        return true;
    }

    const normalized = stripZeroWidthCharacters(
        value.replaceAll(NBSP_REGEX, ' ')
    );

    return normalized.trim() === '';
};
