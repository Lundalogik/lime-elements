import type { Element as HastElement, ElementContent } from 'hast';
import { fromDom } from 'hast-util-from-dom';
import { defaultHandlers, Handle } from 'hast-util-to-mdast';
import type { FootnoteDefinition, RootContent as MdastContent } from 'mdast';
import {
    defaultHandlers as defaultMarkdownHandlers,
    Handle as MarkdownHandle,
} from 'mdast-util-to-markdown';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import {
    CustomElementDefinition,
    MarkdownDescribable,
} from '../../global/shared-types/custom-element.types';

/**
 * Convert rendered markdown content back to markdown, replacing each
 * whitelisted custom element with the markdown it describes itself as.
 *
 * Elements that do not implement {@link MarkdownDescribable} are
 * converted like any unknown element: their light DOM children are kept,
 * and an element without children disappears.
 *
 * @param container - The element holding the rendered content.
 * @param whitelist - The custom elements allowed in the content.
 * @returns The content as GitHub Flavored Markdown.
 */
export async function exportMarkdown(
    container: HTMLElement,
    whitelist: CustomElementDefinition[]
): Promise<string> {
    const tagNames = new Set(
        whitelist
            .map((definition) => definition.tagName)
            .filter(isDescribableTag)
    );

    // The tree is captured before any description is awaited, so that
    // content rendered in the meantime cannot end up in the export without
    // its description.
    const describableElements = new Map<HastElement, MarkdownDescribable>();
    const tree = fromDom(container, {
        afterTransform: (domNode, hastNode) => {
            if (hastNode.type !== 'element') {
                return;
            }

            restoreDeferredImage(hastNode);
            hideFootnoteBackReference(hastNode);

            if (domNode instanceof Element && tagNames.has(domNode.localName)) {
                describableElements.set(
                    hastNode,
                    domNode as Element & MarkdownDescribable
                );
            }
        },
    }) as HastElement;

    await describeElements(describableElements);

    const handlers: Record<string, Handle> = {
        sup: handleSup,
        section: handleSection,
    };
    for (const tagName of tagNames) {
        handlers[tagName] = handleCustomElement;
    }

    const processor = unified()
        .use(rehypeRemark, { handlers })
        .use(remarkGfm)
        .use(remarkStringify, {
            bullet: '-',
            handlers: { break: handleBreak },
        });
    const mdast = await processor.run({
        type: 'root',
        children: tree.children,
    });

    return processor.stringify(mdast).trimEnd();
}

/**
 * The description is kept on the node itself, since `rehype-remark`
 * works on a clone of the tree. It also becomes the node's only child, so
 * that whitespace minification treats the element as content and keeps
 * the spaces around it. An element whose description fails is converted
 * as if it did not describe itself.
 * @param elements
 */
async function describeElements(
    elements: Map<HastElement, MarkdownDescribable>
): Promise<void> {
    await Promise.all(
        [...elements].map(async ([node, element]) => {
            try {
                const description = await element.toMarkdown();
                node.properties.dataMarkdownDescription = description;
                node.children = [{ type: 'text', value: description }];
            } catch (error) {
                console.error('Failed to describe element as markdown', error);
            }
        })
    );
}

const handleCustomElement: Handle = (state, node) => {
    const description = node.properties.dataMarkdownDescription;
    if (typeof description === 'string') {
        return parseMarkdown(description);
    }

    return state.all(node);
};

/**
 * Write hard line breaks as two trailing spaces rather than a backslash,
 * since the export is also read as plain text, where the spaces are
 * invisible.
 * @param args
 */
const handleBreak: MarkdownHandle = (...args) => {
    const markdown = defaultMarkdownHandlers.break(...args);

    return markdown === '\\\n' ? '  \n' : markdown;
};

/**
 * Parse a description into mdast nodes. A description that is a single
 * paragraph gives phrasing content, so that an element inside a
 * paragraph or list item stays inline.
 * @param markdown
 */
function parseMarkdown(markdown: string): MdastContent[] {
    const { children } = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .parse(markdown);
    if (children.length === 1 && children[0].type === 'paragraph') {
        return children[0].children;
    }

    return children;
}

/**
 * An image that has not been scrolled into view yet keeps its URL in
 * `data-src`, until the lazy loading moves it to `src`.
 * @param node
 */
function restoreDeferredImage(node: HastElement) {
    const deferredSrc = node.properties.dataSrc;
    if (node.tagName === 'img' && !node.properties.src && deferredSrc) {
        node.properties.src = deferredSrc;
    }
}

/**
 * The links from a footnote back to its references are recreated when the
 * markdown is rendered again.
 * @param node
 */
function hideFootnoteBackReference(node: HastElement) {
    if (
        node.tagName === 'a' &&
        node.properties.dataFootnoteBackref !== undefined
    ) {
        node.properties.dataMdast = 'ignore';
    }
}

/**
 * Footnotes are labelled with their rendered numbers. The ids only keep an
 * encoded, lowercased form of the original labels, which cannot be turned
 * back into them reliably. A reference shows its footnote's number, and
 * the definitions are listed in the same order.
 * @param state
 * @param node
 */
const handleSup: Handle = (state, node) => {
    const link = node.children.find(
        (child): child is HastElement =>
            isElement(child, 'a') &&
            child.properties.dataFootnoteRef !== undefined
    );
    if (!link) {
        return defaultHandlers.sup(state, node);
    }

    const identifier = link.children
        .map((child) => (child.type === 'text' ? child.value : ''))
        .join('');

    return { type: 'footnoteReference', identifier, label: identifier };
};

const handleSection: Handle = (state, node) => {
    if (node.properties.dataFootnotes === undefined) {
        return defaultHandlers.section(state, node);
    }

    const list = node.children.find((child) => isElement(child, 'ol'));
    const items = list?.children.filter((child) => isElement(child, 'li'));

    return (items ?? []).map((item, index): FootnoteDefinition => {
        const identifier = String(index + 1);

        return {
            type: 'footnoteDefinition',
            identifier,
            label: identifier,
            children: state.toFlow(state.all(item)),
        };
    });
};

function isElement(node: ElementContent, tagName: string): node is HastElement {
    return node.type === 'element' && node.tagName === tagName;
}

/**
 * Whether the custom element registered for the tag implements
 * {@link MarkdownDescribable}. Stencil defines a component's methods on
 * the element's prototype when the tag is registered, before the
 * component itself has loaded.
 * @param tagName
 */
function isDescribableTag(tagName: string): boolean {
    const prototype: Partial<MarkdownDescribable> | undefined =
        customElements.get(tagName)?.prototype;

    return typeof prototype?.toMarkdown === 'function';
}
