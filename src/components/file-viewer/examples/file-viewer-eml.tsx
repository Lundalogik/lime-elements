import { Component, h, Host } from '@stencil/core';

/**
 * Email message files (`.eml`)
 *
 * This example shows previews of RFC 5322 / MIME email messages saved as
 * `.eml` files.
 */
@Component({
    tag: 'limel-example-file-viewer-eml',
    shadow: true,
    styleUrl: 'file-viewer-basic.scss',
})
export class FileViewerEmlExample {
    public render() {
        return (
            <Host>
                <h4>Text-only email</h4>
                <limel-file-viewer url="https://raw.githubusercontent.com/mikel/mail/master/spec/fixtures/emails/plain_emails/basic_email.eml" />
                <h4>Email with inline image</h4>
                <limel-file-viewer url="https://raw.githubusercontent.com/mikel/mail/master/spec/fixtures/emails/attachment_emails/attachment_message_rfc822_inline_image.eml" />
                <h4>Email with PDF attachment</h4>
                <limel-file-viewer url="https://raw.githubusercontent.com/mikel/mail/master/spec/fixtures/emails/attachment_emails/attachment_pdf.eml" />
                <h4>Email with UTF-8 headers</h4>
                <limel-file-viewer url="https://raw.githubusercontent.com/mikel/mail/master/spec/fixtures/emails/rfc6532/utf8_headers.eml" />
                <h4>Multipart report (bounce)</h4>
                <limel-file-viewer url="https://raw.githubusercontent.com/mikel/mail/master/spec/fixtures/emails/multipart_report_emails/report_530.eml" />
            </Host>
        );
    }
}
