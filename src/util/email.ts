/**
 * Attachment metadata extracted from an email message.
 *
 * This is intentionally limited to display-friendly metadata; attachment
 * contents are not included.
 *
 * @public
 */
export interface EmailAttachment {
    /**
     * Suggested filename for the attachment.
     */
    filename?: string;

    /**
     * MIME type (Content-Type) of the attachment.
     */
    mimeType?: string;

    /**
     * Attachment size in bytes, when known.
     */
    size?: number;
}

/**
 * A simplified view-model for a parsed RFC 5322 / MIME email message.
 *
 * @public
 */
export interface Email {
    subject?: string;
    from?: string;
    to?: string;
    cc?: string;
    date?: string;
    bodyHtml?: string;
    bodyText?: string;
    attachments?: EmailAttachment[];
}
