import { Component, h } from '@stencil/core';

/**
 * Email with inline image
 *
 * Example showing an HTML email body that includes an inline image.
 * Uses an image that is already hosted for the Lime Elements docs.
 */
@Component({
    tag: 'limel-example-email-viewer-inline-image',
    shadow: true,
})
export class EmailViewerInlineImageExample {
    public render() {
        const imageUrl =
            'https://lundalogik.github.io/lime-elements/780af2a6-d3d1-4593-8642-f03210d09271.png';

        const bodyHtml = `
            <p>Hi!</p>
            <p>Here is the updated profile picture we should use:</p>
            <p>
                <img
                    src="${imageUrl}"
                    alt="A picture of Lucy Chyzhova, UX designer at Lime Technologies"
                    style="width: 300px;"
                />
            </p>
            <p>Regards,<br/><strong>Jane</strong></p>
        `;

        return (
            <limel-email-viewer
                subject="Updated image"
                from="Jane Doe <jane.doe@example.com>"
                to="Marketing <marketing@example.com>, Web <web@example.com>"
                date="Mon, 20 Jan 2026 10:03:21 +0100"
                bodyHtml={bodyHtml}
            />
        );
    }
}
