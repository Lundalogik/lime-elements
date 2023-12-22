import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkGfm from 'remark-gfm';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';

/**
 * Takes a string as input and returns a new string
 * where the text has been converted to HTML.
 *
 * If the text is formatted with .md markdown, it will
 * be transformed to HTML.
 *
 * If the text already is in HTML it will be sanitized and
 * "dangerous" tags such as <script> will be removed.
 * @param {string} text The string to convert.
 * @param {markdownToHTMLOptions} [options] Options for the conversions.
 * @returns {Promise<string>} The resulting HTML.
 */
export async function markdownToHTML(
    text: string,
    options?: markdownToHTMLOptions
): Promise<string> {
    if (options?.forceHardLineBreaks) {
        text = text.replace(/([\n\r])/g, '  $1');
    }

    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeExternalLinks as any, { target: '_blank' })
        .use(rehypeRaw)
        .use(rehypeSanitize)
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
