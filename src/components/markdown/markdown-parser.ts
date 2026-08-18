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
import type { Options as Schema } from 'rehype-sanitize';
import { createLazyLoadImagesPlugin } from './image-markdown-plugin';
import { CustomElementDefinition } from '../../global/shared-types/custom-element.types';
import { createLinksPlugin } from './link-markdown-plugin';
import { createRemoveEmptyParagraphsPlugin } from './remove-empty-paragraphs-plugin';
import { isSafeImageDataUrl } from './safe-image-data-urls';

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
        .use(rehypeSanitize, getWhiteList(options?.whitelist ?? []))
        .use(createElementSanitizationPlugin())
        .use(createRemoveEmptyParagraphsPlugin(options?.removeEmptyParagraphs))
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
        .use(rehypeSanitize, getWhiteList(whitelist ?? []))
        .use(createElementSanitizationPlugin())
        .use(rehypeStringify)
        .process(html);

    return file.toString();
}

/**
 * Per-element sanitization that runs after `rehype-sanitize`, shared by
 * `markdownToHTML` and `sanitizeHTML` so the same content is never sanitized
 * one way on one path and another way on the other.
 */
function createElementSanitizationPlugin() {
    return () => {
        return (tree: Node) => {
            // Sanitize the value of the `style` attribute, if there is one.
            visit(tree, 'element', sanitizeStyle);
            visit(tree, 'element', stripUnsafeDataUrlSources);
        };
    };
}

/**
 * Removes a `src` holding a `data:` URL that is not an allowed image format.
 *
 * The schema lets `data:` through for `src` so that embedded images survive
 * sanitization, which is wider than the format actually needs to be — this
 * narrows it back down to image data, the only kind we intend to keep.
 *
 * @param node - The element to sanitize.
 */
function stripUnsafeDataUrlSources(node: any) {
    const src = node?.properties?.src;

    if (typeof src !== 'string') {
        return;
    }

    // Only `data:` sources are in scope: every other protocol is already gated
    // by the schema's protocol list, and `isSafeImageDataUrl` rejects them all.
    const isDataUrl = src.trim().toLowerCase().startsWith('data:');

    if (isDataUrl && !isSafeImageDataUrl(src)) {
        delete node.properties.src;
    }
}

function getWhiteList(allowedComponents: CustomElementDefinition[]): Schema {
    const defaultSchemaClone = [...(defaultSchema.attributes['*'] ?? [])];
    const asteriskAttributeWhitelist = defaultSchemaClone.filter((attr) => {
        return attr !== 'height';
    });
    asteriskAttributeWhitelist.push('style');

    const whitelist: Schema = {
        ...defaultSchema,
        // Disable rehype-sanitize's default `user-content-` prefix, which it
        // otherwise prepends to the DOM-clobber attributes (`id`, `name`,
        // `aria-describedby`, `aria-labelledby`).
        //
        // Without this, whitelisted custom elements break: e.g.
        // `<limel-icon name="globe">` becomes `name="user-content-globe"` and
        // the icon no longer resolves. It also keeps GFM footnote ids
        // consistent with the links that reference them — remark-rehype already
        // namespaces those with `user-content-`, and a second prefix here would
        // desync the id (`user-content-user-content-fn-1`) from its link
        // (`#user-content-fn-1`).
        //
        // Set here, in the shared schema, so that both `markdownToHTML` and
        // `sanitizeHTML` behave identically — the same content must not be
        // prefixed on one path and left unprefixed on the other.
        //
        // Safe to disable here because every current consumer renders this
        // output inside a shadow root (`limel-markdown` and `limel-text-editor`
        // are both `shadow: true`). Unprefixed `id`/`name` attributes inside a
        // shadow root cannot clobber document-level globals
        // (`document.getElementById`, `window.<name>`, `document.forms`), which
        // is what the prefix guards against. If a future consumer renders this
        // output into the light DOM — or these functions become public exports
        // — reinstate the prefix or scope its removal to whitelisted custom
        // elements only.
        clobberPrefix: '',
        protocols: {
            ...defaultSchema.protocols,
            // Keep embedded images: the editor stores pasted images as
            // `<img src="data:image/…;base64,…">` when no upload backend is
            // configured, and stripping the protocol here would drop the image
            // data on the way back in. `stripUnsafeDataUrlSources` narrows this
            // to allowed image MIME types once the schema has run.
            src: [...(defaultSchema.protocols?.src ?? []), 'data'],
        },
        strip: [...(defaultSchema.strip ?? []), 'style'],
        tagNames: [
            ...(defaultSchema.tagNames || []),
            // Table column definitions carry the column widths for tables
            // from sources like Google Sheets, where the table element
            // itself has no usable width.
            'colgroup',
            'col',
            ...allowedComponents.map((component) => component.tagName),
        ],
        attributes: {
            ...defaultSchema.attributes,
            p: [
                ...(defaultSchema.attributes.p ?? []),
                ['className', 'MsoNormal'],
            ], // Allow the class 'MsoNormal' on <p> elements
            a: [...(defaultSchema.attributes.a ?? []), 'referrerpolicy'], // Allow referrerpolicy on <a> elements
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
    removeEmptyParagraphs?: boolean;
}
