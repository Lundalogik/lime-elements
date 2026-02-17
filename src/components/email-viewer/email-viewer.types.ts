/**
 * Attachment metadata extracted from an email message.
 *
 * This is intentionally limited to display-friendly metadata; attachment
 * contents are not included.
 *
 * @alpha
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
 * @alpha
 */
export interface Email {
    /**
     * Subject line of the email.
     */
    subject?: string;

    /**
     * Sender address, formatted for display.
     */
    from?: string;

    /**
     * Primary recipient list, formatted for display.
     */
    to?: string;

    /**
     * Carbon-copy recipient list, formatted for display.
     */
    cc?: string;

    /**
     * Message date/time as provided by the source email.
     */
    date?: string;

    /**
     * HTML body content for rendering.
     * Must be sanitized by the caller before assignment when set directly.
     */
    bodyHtml?: string;

    /**
     * Plain-text body content for rendering.
     */
    bodyText?: string;

    /**
     * Parsed attachment metadata as {@link EmailAttachment} items.
     */
    attachments?: EmailAttachment[];
}

/**
 * The header field keys of an {@link Email} that are rendered
 * in the email viewer header section.
 *
 * @alpha
 */
export type EmailHeaderType = 'subject' | 'from' | 'to' | 'cc' | 'date';
