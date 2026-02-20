import PostalMime from 'postal-mime';
import { Email } from './email-viewer.types';
import { sanitizeEmailHTML } from './sanitize-email-html';

/**
 * Email loading/parsing helpers for `limel-file-viewer`.
 *
 * Parses an RFC 5322 / MIME email message (commonly stored as a `.eml` file)
 * and returns a simplified `Email` view-model.
 */

/**
 * Fetches and parses an email message.
 *
 * - Prefers `email.html` if present, otherwise falls back to `email.text`.
 * - Attempts to resolve inline images referenced via `cid:` by replacing
 *   `<img src="cid:...">` with `data:` URLs generated from inline attachments.
 *
 * @param url - URL to an email message, usually ending in `.eml`.
 * @returns A simplified `Email` object for rendering.
 */
export async function loadEmail(url: string): Promise<Email> {
    const buffer = await fetchEmailBuffer(url);
    const email = await parseEmail(url, buffer);

    const parsedEmail: Email = {
        subject: email.subject || undefined,
        from: formatAddress(email.from),
        to: formatAddresses(email.to),
        cc: formatAddresses(email.cc),
        date: getRawHeader(email, 'date') || email.date || undefined,
    };

    const { attachments, cidUrlById } = extractAttachments(email);
    if (attachments.length > 0) {
        parsedEmail.attachments = attachments;
    }

    await applyBody(parsedEmail, email, cidUrlById);

    return parsedEmail;
}

async function fetchEmailBuffer(url: string): Promise<ArrayBuffer> {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Failed to fetch email (${response.status} ${response.statusText})`
            );
        }

        return await response.arrayBuffer();
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to load email from ${url}: ${message}`);
    }
}

async function parseEmail(url: string, buffer: ArrayBuffer): Promise<any> {
    try {
        return await PostalMime.parse(buffer, {
            attachmentEncoding: 'arraybuffer',
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to parse email from ${url}: ${message}`);
    }
}

function getRawHeader(email: any, name: string): string | undefined {
    const header = (email.headers || []).find(
        (h: any) => h.key === name.toLowerCase()
    );

    return header?.value || undefined;
}

function extractAttachments(email: any): {
    attachments: Email['attachments'];
    cidUrlById: Map<string, string>;
} {
    const attachments: Email['attachments'] = [];
    const cidUrlById = new Map<string, string>();

    for (const attachment of email.attachments || []) {
        const contentId = normalizeContentId(attachment.contentId);
        const isInline =
            attachment.related || attachment.disposition === 'inline';

        if (!isInline) {
            const size =
                attachment.content instanceof ArrayBuffer
                    ? attachment.content.byteLength
                    : undefined;

            attachments.push({
                filename: attachment.filename || undefined,
                mimeType: attachment.mimeType || undefined,
                size,
            });
            continue;
        }

        const hasArrayBufferContent = attachment.content instanceof ArrayBuffer;

        if (!contentId || !hasArrayBufferContent) {
            const size = hasArrayBufferContent
                ? attachment.content.byteLength
                : undefined;

            attachments.push({
                filename: attachment.filename || undefined,
                mimeType: attachment.mimeType || 'application/octet-stream',
                size,
            });
            continue;
        }

        const mimeType = attachment.mimeType || 'application/octet-stream';
        const base64 = arrayBufferToBase64(attachment.content);
        const dataUrl = `data:${mimeType};base64,${base64}`;
        cidUrlById.set(contentId, dataUrl);
    }

    return { attachments, cidUrlById };
}

async function applyBody(
    parsedEmail: Email,
    email: any,
    cidUrlById: Map<string, string>
) {
    const html = (email.html || '').trim();
    if (html) {
        const withCidsResolved = replaceCidReferences(html, cidUrlById);
        parsedEmail.bodyHtml = await sanitizeEmailHTML(withCidsResolved);
        return;
    }

    parsedEmail.bodyText = (email.text || '').trim() || undefined;
}

/**
 * Normalizes a Content-ID by removing surrounding angle brackets.
 *
 * Example: `<image@id>` -> `image@id`
 *
 * @param contentId - The Content-ID to normalize, optionally surrounded by angle brackets.
 */
function normalizeContentId(contentId?: string): string {
    if (!contentId) {
        return '';
    }

    let normalized = contentId.trim();

    if (normalized.startsWith('<')) {
        normalized = normalized.slice(1);
    }

    if (normalized.endsWith('>')) {
        normalized = normalized.slice(0, -1);
    }

    return normalized.trim();
}

function replaceCidReferences(
    html: string,
    cidUrlById: Map<string, string>
): string {
    if (cidUrlById.size === 0) {
        return html;
    }

    return html.replaceAll(
        /(src\s*=\s*["']?)cid:([^"'\s>]+)(["']?)/gi,
        (match, prefix, cid, suffix) => {
            const normalized = normalizeContentId(cid);
            const replacement = cidUrlById.get(normalized);
            if (!replacement) {
                return match;
            }

            return `${prefix}${replacement}${suffix}`;
        }
    );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);

    if (typeof btoa === 'function') {
        let binary = '';
        for (const byte of bytes) {
            binary += String['fromCharCode'](byte);
        }
        return btoa(binary);
    }

    // Jest/Node fallback
    return (globalThis as any).Buffer.from(bytes).toString('base64');
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.length > 0;
}

/**
 * Formats one or many address objects returned by PostalMime.
 *
 * @param addresses - Address object(s) to format.
 * @returns Formatted address string, or undefined if no valid addresses.
 */
function formatAddresses(addresses: any): string | undefined {
    if (!addresses) {
        return undefined;
    }

    const list = Array.isArray(addresses) ? addresses : [addresses];
    const parts = list
        .map((addr) => formatAddress(addr))
        .filter(isNonEmptyString);

    return parts.length > 0 ? parts.join(', ') : undefined;
}

function formatAddress(address: any): string | undefined {
    if (!address) {
        return undefined;
    }

    if (Array.isArray(address)) {
        return formatAddresses(address);
    }

    if (address.group && Array.isArray(address.group)) {
        const groupName = (address.name || '').trim();
        const groupMembers = address.group
            .map((m) => formatAddress(m))
            .filter(isNonEmptyString)
            .join(', ');

        if (groupName && groupMembers) {
            return `${groupName}: ${groupMembers}`;
        }

        return groupName || groupMembers || undefined;
    }

    const name = (address.name || '').trim();
    const email = (address.address || '').trim();

    if (name && email) {
        const displayName = quoteDisplayNameIfNeeded(name);
        return `${displayName} <${email}>`;
    }

    return name || email || undefined;
}

function quoteDisplayNameIfNeeded(name: string): string {
    if (!name) {
        return '';
    }

    // If the display name contains a comma, it must be quoted for safe parsing
    // of comma-separated address lists.
    if (!name.includes(',') && !name.includes('"')) {
        return name;
    }

    const escaped = name.replaceAll('\\', '\\\\').replaceAll('"', '\\' + '"');
    return `"${escaped}"`;
}
