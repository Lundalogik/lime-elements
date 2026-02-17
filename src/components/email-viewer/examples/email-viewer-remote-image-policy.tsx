import { Component, h } from '@stencil/core';
import { Email } from '@limetech/lime-elements';

/**
 * Email with remote image policy
 *
 * Example showing an HTML email body where remote images are represented as
 * `data-remote-src`, which triggers the remote-images warning banner.
 *
 * This mirrors the shape produced by `loadEmail`, where remote image URLs are
 * rewritten to `data-remote-src` and only restored when the user allows remote
 * images.
 */
@Component({
    tag: 'limel-example-email-viewer-remote-image-policy',
    shadow: true,
})
export class EmailViewerRemoteImagePolicyExample {
    public render() {
        const imageUrl =
            'https://lundalogik.github.io/lime-elements/780af2a6-d3d1-4593-8642-f03210d09271.png';

        const bodyHtml = `
            <p>Hi!</p>
            <p>
                This example uses <code>data-remote-src</code> so the warning
                banner is shown until remote images are explicitly allowed.
            </p>
            <p>
                <img
                    data-remote-src="${imageUrl}"
                    alt="A picture of Lucy Chyzhova, UX designer at Lime Technologies"
                    style="width: 300px;"
                />
            </p>
            <p>Regards,<br/><strong>Lucy</strong></p>
        `;

        const email: Email = {
            subject: 'Remote image policy demo',
            from: 'Jane Doe <jane.doe@example.com>',
            to: 'Marketing <marketing@example.com>, Web <web@example.com>',
            date: 'Mon, 20 Jan 2026 10:03:21 +0100',
            bodyHtml: bodyHtml,
        };

        return <limel-email-viewer email={email} />;
    }
}
