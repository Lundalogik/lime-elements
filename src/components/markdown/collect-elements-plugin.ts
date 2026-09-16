import { Plugin, Transformer } from 'unified';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';
import { toHtml } from 'hast-util-to-html';

/**
 * Where one whitelisted custom element was written in the text the
 * HTML was made from.
 */
export interface SourceElement {
    tagName: string;

    /** Offset of the `<` that opens the element. */
    start: number;

    /**
     * Offset just past the element's markup: past its closing tag when
     * it has one, otherwise past its start tag. A custom element cannot
     * self-close in HTML, so an element written `<x/>` swallows what
     * follows it into its content; only the tag itself is its markup.
     */
    end: number;

    /** Written with a closing tag. */
    closed: boolean;

    /**
     * The element as the render serialized it: the tag with the
     * attributes the sanitizer allowed, and its content when it was
     * closed. What follows an unclosed element is not its content,
     * however the parser nested it.
     */
    html: string;
}

interface CollectElementsOptions {
    /** Tag names to record, lower-cased. */
    tagNames: string[];

    /** The text the tree was parsed from, as parsed. */
    text: string;

    /** Receives the elements in document order. */
    onCollected: (elements: SourceElement[]) => void;
}

/**
 * Record where the whitelisted custom elements in the tree were written,
 * in document order. The parser keeps the source position of every
 * element it created from raw HTML, so this is the parser's own reading
 * of what is markup: a tag inside a code span is text and is not
 * recorded.
 *
 * @param options - what to record, and where to deliver it
 * @returns the plugin
 */
export const createCollectElementsPlugin = (
    options: CollectElementsOptions
): Plugin => {
    const tagNames = new Set(options.tagNames);

    return (): Transformer => {
        return (tree: Node) => {
            const elements: SourceElement[] = [];
            visit(tree, 'element', (node: any) => {
                if (!tagNames.has(node.tagName)) {
                    return;
                }

                const element = locate(node, options.text);
                if (element) {
                    elements.push(element);
                }
            });
            options.onCollected(elements);

            return tree;
        };
    };
};

function locate(node: any, text: string): SourceElement | undefined {
    const start: number | undefined = node.position?.start?.offset;
    if (start === undefined) {
        return undefined;
    }

    // The parser only knows where an element ends when it saw a closing
    // tag; without one it reports an end that is not usable.
    const end: number = node.position?.end?.offset ?? 0;
    const closingTag = new RegExp(String.raw`</${node.tagName}\s*>$`, 'i');
    if (end > start && closingTag.test(text.slice(start, end))) {
        return {
            tagName: node.tagName,
            start,
            end,
            closed: true,
            html: toHtml(node),
        };
    }

    return {
        tagName: node.tagName,
        start: start,
        end: endOfStartTag(text, start),
        closed: false,
        html: toHtml({ ...node, children: [] }),
    };
}

/**
 * The offset just past the `>` that ends the start tag at `start`,
 * skipping any `>` inside a quoted attribute value.
 * @param text
 * @param start
 */
function endOfStartTag(text: string, start: number): number {
    let quote: string | undefined;
    for (let index = start + 1; index < text.length; index++) {
        const character = text[index];
        if (quote) {
            if (character === quote) {
                quote = undefined;
            }
        } else if (character === '"' || character === "'") {
            quote = character;
        } else if (character === '>') {
            return index + 1;
        }
    }

    return text.length;
}
