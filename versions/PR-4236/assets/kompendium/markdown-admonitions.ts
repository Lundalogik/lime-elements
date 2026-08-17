import type { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';
import { isParent } from './markdown-nodes';

interface DirectiveNode extends Parent {
    name: string;
    data?: Record<string, unknown>;
}

const ADMONITION_TYPES = new Map([
    ['note', 'secondary'],
    ['important', 'info'],
    ['tip', 'success'],
    ['warning', 'danger'],
    ['caution', 'warning'],
]);

const TYPES_PATTERN = [...ADMONITION_TYPES.keys()].join('|');
const LEGACY_SYNTAX = new RegExp(
    `^(:::(?:${TYPES_PATTERN}))[^\\S\\n]+(?!\\[)(.+?)[^\\S\\n]*$`,
    'gm',
);

export function normalizeLegacyAdmonitions(text: string): string {
    return text.replace(LEGACY_SYNTAX, '$1[$2]');
}

export function admonitions(): (tree: Node) => void {
    return (tree: Node) => {
        visit(tree, 'containerDirective', (node: DirectiveNode) => {
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

interface ExtractedLabel {
    label: string;
    children: Node[];
}

function extractLabel(node: DirectiveNode): ExtractedLabel {
    const labelNode = node.children.find(
        (child: Node & { data?: Record<string, unknown> }) =>
            child.data?.directiveLabel,
    );

    if (!labelNode || !isParent(labelNode)) {
        return { label: node.name, children: node.children };
    }

    const filtered = node.children.filter((child: Node) => child !== labelNode);

    return {
        label: extractText(labelNode) || node.name,
        children: filtered,
    };
}

function extractText(node: Node): string {
    if (node.type === 'text') {
        return (node as Node & { value: string }).value;
    }

    if (!isParent(node)) {
        return '';
    }

    return node.children.map(extractText).join('');
}
