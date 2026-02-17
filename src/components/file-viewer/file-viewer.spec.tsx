import { newSpecPage } from '@stencil/core/testing';
import { FileViewer } from './file-viewer';
import { EmailViewer } from '../email-viewer/email-viewer';

import { Blob as NodeBlob } from 'node:buffer';

// `postal-mime` expects `Blob` to exist, but the Stencil/Jest spec
// environment does not provide it.
if (!globalThis.Blob) {
    (globalThis as any).Blob = NodeBlob;
}

describe('limel-file-viewer', () => {
    const testCases = [
        { url: 'example.jpg', type: 'image' },
        { url: 'example.mp4', type: 'video' },
        { url: 'example.mp3', type: 'audio' },
        { url: 'example.txt', type: 'text' },
        { url: 'example.eml', type: 'email' },
        { url: 'example.xyz', type: 'unknown' },
    ];

    for (const testCase of testCases) {
        it(`renders a ${testCase.type} viewer`, async () => {
            const originalFetch = globalThis.fetch;
            try {
                if (testCase.type === 'email') {
                    const eml =
                        'Subject: Hello\r\n' +
                        'From: Example <example@example.com>\r\n' +
                        'To: You <you@example.com>\r\n' +
                        'Content-Type: text/plain; charset=utf-8\r\n' +
                        '\r\n' +
                        'Hello from EML!\r\n';

                    globalThis.fetch = jest.fn().mockResolvedValue({
                        ok: true,
                        arrayBuffer: async () =>
                            new TextEncoder().encode(eml).buffer,
                    } as any);
                }

                const components =
                    testCase.type === 'email' ||
                    testCase.url.toLowerCase().endsWith('.eml')
                        ? [FileViewer, EmailViewer]
                        : [FileViewer];

                const page = await newSpecPage({
                    components,
                    html: `<limel-file-viewer url="${testCase.url}"></limel-file-viewer>`,
                });

                expect(page.root).toBeDefined();

                if (testCase.type === 'email') {
                    await page.waitForChanges();
                    const emailViewer =
                        page.root?.shadowRoot?.querySelector(
                            'limel-email-viewer'
                        );
                    expect(emailViewer).toBeTruthy();

                    const emailText =
                        emailViewer?.shadowRoot?.textContent ?? '';
                    expect(emailText).toContain('Hello');
                    expect(emailText).toContain('Hello from EML!');
                }
            } finally {
                globalThis.fetch = originalFetch;
            }
        });
    }
});

describe('limel-file-viewer officeViewer', () => {
    const testCases = [
        { url: 'example.docx', officeViewer: 'microsoft-office' },
        { url: 'example.docx', officeViewer: 'google-drive' },
        { url: 'example.odp', officeViewer: 'microsoft-office' },
    ];

    for (const testCase of testCases) {
        it(`renders using ${testCase.officeViewer} officeViewer`, async () => {
            const page = await newSpecPage({
                components: [FileViewer],
                html: `<limel-file-viewer url="${testCase.url}" officeViewer="${testCase.officeViewer}"></limel-file-viewer>`,
            });

            expect(page.root).toBeDefined();
        });
    }
});
