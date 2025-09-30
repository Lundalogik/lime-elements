import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkGfm from 'remark-gfm';
import rehypeParse from 'rehype-parse';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import { visit } from 'unist-util-visit';
import { sanitizeStyle } from './sanitize-style';
import { Node } from 'unist';
import { Schema } from 'rehype-sanitize/lib';
import { createLazyLoadImagesPlugin } from './image-markdown-plugin';
import { CustomElementDefinition } from '../../global/shared-types/custom-element.types';
import { createLinksPlugin } from './link-markdown-plugin';

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
    options?: MarkdownToHTMLOptions
): Promise<string> {
    if (options?.forceHardLineBreaks) {
        text = text.replaceAll(/(?<!\\)([\n\r])/g, '  $1');
    }

    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(createLinksPlugin())
        .use(rehypeSanitize, {
            ...getWhiteList(options?.whitelist ?? []),
        })
        .use(() => {
            return (tree: Node) => {
                // Remove the task list paragraph wrapping transformation
                // as it causes layout issues. Task lists work better with
                // direct text content and CSS flexbox layout.
                
                // Run the sanitizeStyle function on all elements, to sanitize
                // the value of the `style` attribute, if there is one.
                visit(tree, 'element', sanitizeStyle);
            };
        })
        .use(createLazyLoadImagesPlugin(options?.lazyLoadImages))
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
    whitelist?: CustomElementDefinition[]
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

function getWhiteList(allowedComponents: CustomElementDefinition[]): Schema {
    const defaultSchemaClone = [...(defaultSchema.attributes['*'] ?? [])];
    const asteriskAttributeWhitelist = defaultSchemaClone.filter((attr) => {
        return attr !== 'height';
    });
    asteriskAttributeWhitelist.push('style');

    const whitelist: Schema = {
        ...defaultSchema,
        tagNames: [
            ...(defaultSchema.tagNames || []),
            'input', // Explicitly allow input elements for task list checkboxes
            'limel-checkbox', // Allow limel-checkbox component for task lists
            ...allowedComponents.map((component) => component.tagName),
        ],
        attributes: {
            ...defaultSchema.attributes,
            p: [
                ...(defaultSchema.attributes.p ?? []),
                ['className', 'MsoNormal'],
            ], // Allow the class 'MsoNormal' on <p> elements
            a: [...(defaultSchema.attributes.a ?? []), 'referrerpolicy'], // Allow referrerpolicy on <a> elements
            // Allow task list specific classes and attributes
            ul: [
                ...(defaultSchema.attributes.ul ?? []),
                ['className', 'task-list'],
                ['className', 'contains-task-list'], // Allow remark-gfm generated class
            ],
            li: [
                ...(defaultSchema.attributes.li ?? []),
                ['className', 'task-list-item'],
            ],
            div: [
                ...(defaultSchema.attributes.div ?? []),
                ['className', 'task-list-item-content'],
            ],
            input: [
                ...(defaultSchema.attributes.input ?? []),
                'type',
                'checked',
                'disabled',
            ],
            // Allow limel-checkbox attributes
            'limel-checkbox': [
                'checked',
                'disabled',
                'readonly',
                'invalid',
                'required',
                'indeterminate',
                ['className'],
            ],
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
export interface MarkdownToHTMLOptions {
    /**
     * Set to `true` to convert all soft line breaks to hard line breaks.
     */
    forceHardLineBreaks?: boolean;
    whitelist?: CustomElementDefinition[];
    lazyLoadImages?: boolean;
}
