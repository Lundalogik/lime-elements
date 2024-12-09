import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkGfm from 'remark-gfm';
import rehypeParse from 'rehype-parse';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import { visit } from 'unist-util-visit';
import { sanitizeStyle } from './sanitize-style';
import { Node } from 'unist';
import { Schema } from 'rehype-sanitize/lib';
import { CustomElement } from '../../global/shared-types/custom-element.types';

/**
 * Takes a string as input and returns a new string
 * where the text has been converted to HTML.
 *
 * If the text is formatted with .md markdown, it will
 * be transformed to HTML.
 *
 * If the text already is in HTML it will be sanitized and
 * "dangerous" tags such as <script> will be removed.
 *
 * @param text - The string to convert.
 * @param options - Options for the conversions.
 * @returns The resulting HTML.
 */
export async function markdownToHTML(
    text: string,
    options?: markdownToHTMLOptions,
): Promise<string> {
    if (options?.forceHardLineBreaks) {
        text = text.replace(/(?<!\\)([\n\r])/g, '  $1');
    }

    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeExternalLinks, { target: '_blank' })
        .use(rehypeRaw)
        .use(rehypeSanitize, {
            ...getWhiteList(options?.whitelist ?? []),
        })
        .use(() => {
            return (tree: Node) => {
                // Run the sanitizeStyle function on all elements, to sanitize
                // the value of the `style` attribute, if there is one.
                visit(tree, 'element', sanitizeStyle);
            };
        })
        .use(rehypeStringify)
        .process(text);

    return file.toString();
}

/**
 * Sanitizes a given HTML string by removing dangerous tags and attributes.
 *
 * @param html - The string containing HTML to sanitize.
 * @param whitelist - Optional whitelist of custom components.
 * @returns The sanitized HTML string.
 */
export async function sanitizeHTML(
    html: string,
    whitelist?: CustomElement[],
): Promise<string> {
    const file = await unified()
        .use(rehypeParse)
        .use(rehypeSanitize, {
            ...getWhiteList(whitelist ?? []),
        })
        .use(() => {
            return (tree: Node) => {
                // Run the sanitizeStyle function on all elements, to sanitize
                // the value of the `style` attribute, if there is one.
                visit(tree, 'element', sanitizeStyle);
            };
        })
        .use(rehypeStringify)
        .process(html);

    return file.toString();
}

function getWhiteList(allowedComponents: CustomElement[]): Schema {
    const defaultSchemaClone = [...(defaultSchema.attributes['*'] ?? [])];
    const asteriskAttributeWhitelist = defaultSchemaClone.filter((attr) => {
        return attr !== 'height';
    });
    asteriskAttributeWhitelist.push('style');

    const whitelist: Schema = {
        ...defaultSchema,
        tagNames: [
            ...(defaultSchema.tagNames || []),
            ...allowedComponents.map((component) => component.tagName),
        ],
        attributes: {
            ...defaultSchema.attributes,
            p: [
                ...(defaultSchema.attributes.p ?? []),
                ['className', 'MsoNormal'],
            ], // Allow the class 'MsoNormal' on <p> elements
            '*': asteriskAttributeWhitelist,
        },
    };

    for (const component of allowedComponents) {
        whitelist.attributes[component.tagName] = component.attributes;
    }

    return whitelist;
}

/**
 * Options for markdownToHTML.
 */
export interface markdownToHTMLOptions {
    /**
     * Set to `true` to convert all soft line breaks to hard line breaks.
     */
    forceHardLineBreaks?: boolean;
    whitelist?: CustomElement[];
}
