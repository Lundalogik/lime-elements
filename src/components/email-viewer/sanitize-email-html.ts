import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';

const allowedMimeTypes = new Set([
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/x-icon',
    'image/vnd.microsoft.icon',
]);

/**
 * Sanitizes email HTML to prevent XSS and other security issues while
 * preserving the original visual appearance (layout, colors, fonts, etc.).
 *
 * This differs from the markdown sanitizer (`sanitizeHTML`) in that:
 * - **All inline CSS is preserved** (no style property filtering).
 * - Dangerous CSS properties like `behavior`, `expression`, `-moz-binding` are removed.
 * - Standard dangerous tags/attributes are blocked (script, event handlers, javascript: URLs).
 *
 * @param html - The HTML string to sanitize (typically an email body).
 * @returns The sanitized HTML string.
 */
export async function sanitizeEmailHTML(html: string): Promise<string> {
    const file = await unified()
        .use(rehypeParse)
        .use(rehypeSanitize, emailSanitizationSchema)
        .use(() => {
            return (tree: any) => {
                visit(tree, 'element', (node) => {
                    sanitizeDangerousCss(node);
                    sanitizeDangerousUrls(node);
                });
            };
        })
        .use(rehypeStringify)
        .process(html);

    return file.toString();
}

// Base src protocols from defaultSchema, extended with 'data' below.
const defaultSrcProtocols = defaultSchema.protocols?.src ?? [];

/**
 * Rehype-sanitize schema that allows all standard HTML elements and attributes
 * needed for rich email rendering, including `style`.
 *
 * Hoisted to module scope since the schema has no runtime dependencies and
 * doesn't need to be reconstructed on every sanitization call.
 */
const emailSanitizationSchema = {
    ...defaultSchema,
    // Disable the 'user-content-' prefix that rehype-sanitize adds to
    // id and name attributes. Email HTML uses ids for internal anchor
    // links (href="#section") that must resolve without a prefix.
    clobberPrefix: '',
    protocols: {
        ...defaultSchema.protocols,
        // Email bodies often embed images as data URLs. We allow `data:` here,
        // but still validate the MIME type in `sanitizeDangerousUrls`.
        src: [...defaultSrcProtocols, 'data'],
    },
    attributes: {
        ...defaultSchema.attributes,
        table: [
            ...(defaultSchema.attributes.table ?? []),
            // Email HTML often relies on these legacy attributes.
            // rehype-parse converts to camelCase HAST properties.
            'cellPadding',
            'cellSpacing',
            'border',
            'dir',
            'width',
            'height',
        ],
        font: ['color', 'size', 'face'],
        meta: ['charset', 'content', 'name'],
        colgroup: [...(defaultSchema.attributes.colgroup ?? []), 'span'],
        col: [...(defaultSchema.attributes.col ?? []), 'width', 'span'],
        '*': [
            ...(defaultSchema.attributes['*'] ?? []),
            'style', // Allow inline styles on all elements
            // NOTE: rehype/parse maps `class` to the HAST property name
            // `className`, which is what rehype-sanitize checks.
            'className',
            'id', // Allow id for anchors/internal navigation
            // Used to store remote image URLs without loading them immediately.
            'dataRemoteSrc',
        ],
    },
    // Allow common email-specific tags
    tagNames: [
        ...(defaultSchema.tagNames ?? []),
        // Allow full-document HTML emails. These tags won't render as text,
        // but keeping them avoids their contents being surfaced as plain text.
        'html',
        'head',
        'body',
        'title',
        'meta',
        // Preserve embedded email CSS.
        'style',
        // Preserve table column sizing when using <colgroup>/<col>.
        'colgroup',
        'col',
        'center', // Deprecated but widely used in email
        'font', // Deprecated but widely used in email
    ],
};

/**
 * Validates and normalizes potentially dangerous URL attributes.
 *
 * Currently only handles `<img src>` and allows safe embedded `data:image/*`.
 *
 * @param node - The HTML element node to sanitize.
 */
function sanitizeDangerousUrls(node: any) {
    if (!node?.tagName || node.tagName !== 'img') {
        return;
    }

    const src = node.properties?.src;
    if (typeof src !== 'string') {
        return;
    }

    const safeSrc = getSafeEmailImageSrc(src);
    if (safeSrc) {
        node.properties.src = safeSrc;
        delete node.properties.dataRemoteSrc;
        return;
    }

    const remoteSrc = getRemoteEmailImageSrc(src);
    if (remoteSrc) {
        // Avoid loading remote images by default. Store the URL so the viewer can
        // opt-in and restore it later.
        node.properties.dataRemoteSrc = remoteSrc;
        delete node.properties.src;
        return;
    }

    // Keep the <img> but strip the source.
    delete node.properties.src;
}

/**
 * Returns a safe image `src` for email rendering.
 *
 * Only permits embedded `data:` URLs with an allow-listed image MIME type.
 *
 * @param src - The raw `src` attribute value.
 * @returns A safe `src` to keep, or `undefined` to strip it.
 */
function getSafeEmailImageSrc(src: string): string | undefined {
    const trimmedSrc = src.trim();
    if (!trimmedSrc) {
        return;
    }

    // Only allow embedded images. Loading remote images has privacy implications
    // (tracking pixels) and may leak network details.
    if (!trimmedSrc.toLowerCase().startsWith('data:')) {
        return;
    }

    const mimeType = getDataUrlMimeType(trimmedSrc);
    if (!mimeType) {
        return;
    }

    if (!allowedMimeTypes.has(mimeType)) {
        return;
    }

    return trimmedSrc;
}

/**
 * Returns a safe remote image URL to keep for later opt-in loading.
 *
 * @param src - The raw `src` attribute value.
 * @returns The remote URL if it is http/https.
 */
function getRemoteEmailImageSrc(src: string): string | undefined {
    const trimmedSrc = src.trim();
    const lower = trimmedSrc.toLowerCase();
    if (lower.startsWith('http://') || lower.startsWith('https://')) {
        return trimmedSrc;
    }
}

/**
 * Extracts the MIME type from a `data:` URL.
 *
 * @param dataUrl - A `data:` URL string.
 * @returns The MIME type if present.
 */
function getDataUrlMimeType(dataUrl: string): string | undefined {
    // data:[<mime type>][;charset=<charset>][;base64],<data>
    const match = /^data:([^;,]+)(?:;charset=[^;,]+)?(?:;base64)?,/i.exec(
        dataUrl
    );
    const mimeType = match?.[1]?.toLowerCase();
    return mimeType || undefined;
}

/**
 * Removes dangerous constructs from inline CSS (style attributes and `<style>` tags).
 *
 * @param node - The HTML element node to sanitize.
 */
function sanitizeDangerousCss(node: any) {
    if (!node?.tagName) {
        return;
    }

    if (node.properties?.style && typeof node.properties.style === 'string') {
        node.properties.style = stripDangerousCss(node.properties.style);
    }

    if (node.tagName === 'style' && Array.isArray(node.children)) {
        for (const child of node.children) {
            if (child?.type === 'text' && typeof child.value === 'string') {
                child.value = stripDangerousCss(child.value);
            }
        }
    }
}

/**
 * Removes common script-capable CSS constructs.
 *
 * @param css - A CSS string from a style attribute or `<style>` tag.
 * @returns The CSS with dangerous constructs removed.
 */
function stripDangerousCss(css: string): string {
    // Minimal defensive filtering. We preserve styling for fidelity, but drop
    // well-known script-capable constructs (mostly relevant in legacy engines).
    const dangerousPatterns = [
        /behavior\s*:/gi,
        /expression\s*\(/gi,
        /-moz-binding\s*:/gi,
        /vbscript\s*:/gi,
        /javascript\s*:/gi,
    ];

    const importPattern = /@import\s+(?:url\([^)]{0,2000}\)|[^;]{0,2000});?/gi;
    const urlPattern =
        /url\(\s{0,50}(?:"([^"]{0,2000})"|'([^']{0,2000})'|([^"')\s]{1,2000}))\s{0,50}\)/gi;

    const isSafeCssUrl = (value: string) => {
        const normalized = value.trim().toLowerCase();

        if (
            normalized.startsWith('data:') ||
            normalized.startsWith('cid:') ||
            normalized.startsWith('#')
        ) {
            return true;
        }

        return (
            !normalized.startsWith('//') &&
            !/^[a-z][a-z0-9+.-]*:/i.test(normalized)
        );
    };

    let cleaned = css;
    for (const pattern of dangerousPatterns) {
        cleaned = cleaned.replaceAll(pattern, '');
    }

    cleaned = cleaned.replaceAll(importPattern, '');
    cleaned = cleaned.replaceAll(urlPattern, (match, first, second, third) => {
        const value = (first ?? second ?? third ?? '').trim();
        return isSafeCssUrl(value) ? match : 'url("")';
    });

    return cleaned;
}
