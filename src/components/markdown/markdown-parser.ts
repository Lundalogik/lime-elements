import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkGfm from 'remark-gfm';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import parse from 'style-to-object';
import { visit } from 'unist-util-visit';
import { allowedCssProperties } from './allowed-css-properties';
import parseCSSColor from 'parse-css-color';

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
        text = text.replace(/([\n\r])/g, '  $1');
    }

    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeExternalLinks, { target: '_blank' })
        .use(rehypeRaw)
        .use(rehypeSanitize, {
            attributes: {
                '*': ['style'],
            },
        })
        .use(() => {
            return (tree: any) => {
                visit(tree, 'element', sanitizeStyle);
            };
        })
        .use(rehypeStringify)
        .process(text);

    return file.toString();
}

/**
 * Options for markdownToHTML.
 */
export interface markdownToHTMLOptions {
    /**
     * Set to `true` to convert all soft line breaks to hard line breaks.
     */
    forceHardLineBreaks?: boolean;
}

function sanitizeStyle(node: any) {
    if (node.tagName && node.properties && node.properties.style) {
        // Sanitize the 'style' attribute of the node.
        node.properties.style = sanitizeStyleValue(node.properties.style);
    }
}

function sanitizeStyleValue(styleValue: string): string {
    try {
        const css = parse(styleValue);
        if ('background' in css) {
            const color = parseCSSColor(css.background);
            if (color) {
                css['background-color'] = css.background;
            }

            delete css.background;
        }

        return Object.entries(css)
            .filter(([key]) => allowedCssProperties.includes(key))
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse style value', styleValue, error);

        return '';
    }
}
