import { map } from "unist-util-map";
import { isElement } from "./markdown-nodes";
export function kompendiumCode() {
    return transformer;
}
function transformer(tree) {
    return map(tree, mapCodeNode);
}
function mapCodeNode(node) {
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
function getLanguage(props) {
    const className = props === null || props === void 0 ? void 0 : props.className;
    if (!Array.isArray(className)) {
        return;
    }
    const languageClass = className.find((name) => name.startsWith('language-'));
    if (!languageClass) {
        return;
    }
    return languageClass.replace('language-', '');
}
