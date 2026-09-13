import { visit } from "unist-util-visit";
import { isParent } from "./markdown-nodes";
const ADMONITION_TYPES = new Map([
    ['note', 'secondary'],
    ['important', 'info'],
    ['tip', 'success'],
    ['warning', 'danger'],
    ['caution', 'warning'],
]);
const TYPES_PATTERN = [...ADMONITION_TYPES.keys()].join('|');
const LEGACY_SYNTAX = new RegExp(`^(:::(?:${TYPES_PATTERN}))[^\\S\\n]+(?!\\[)(.+?)[^\\S\\n]*$`, 'gm');
export function normalizeLegacyAdmonitions(text) {
    return text.replace(LEGACY_SYNTAX, '$1[$2]');
}
export function admonitions() {
    return (tree) => {
        visit(tree, 'containerDirective', (node) => {
            const ifmClass = ADMONITION_TYPES.get(node.name);
            if (!ifmClass) {
                return;
            }
            const { label, children } = extractLabel(node);
            const content = children;
            node.data = {
                hName: 'div',
                hProperties: {
                    className: [
                        'admonition',
                        `admonition-${node.name}`,
                        'alert',
                        `alert--${ifmClass}`,
                    ],
                },
            };
            node.children = [
                {
                    type: 'admonitionHeading',
                    data: {
                        hName: 'div',
                        hProperties: { className: ['admonition-heading'] },
                    },
                    children: [
                        {
                            type: 'admonitionTitle',
                            data: { hName: 'h5' },
                            children: [{ type: 'text', value: label }],
                        },
                    ],
                },
                {
                    type: 'admonitionContent',
                    data: {
                        hName: 'div',
                        hProperties: { className: ['admonition-content'] },
                    },
                    children: content,
                },
            ];
        });
    };
}
function extractLabel(node) {
    const labelNode = node.children.find((child) => { var _a; return (_a = child.data) === null || _a === void 0 ? void 0 : _a.directiveLabel; });
    if (!labelNode || !isParent(labelNode)) {
        return { label: node.name, children: node.children };
    }
    const filtered = node.children.filter((child) => child !== labelNode);
    return {
        label: extractText(labelNode) || node.name,
        children: filtered,
    };
}
function extractText(node) {
    if (node.type === 'text') {
        return node.value;
    }
    if (!isParent(node)) {
        return '';
    }
    return node.children.map(extractText).join('');
}
