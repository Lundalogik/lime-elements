import { render, h } from '@stencil/vitest';

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

                    globalThis.fetch = vi.fn().mockResolvedValue({
                        ok: true,
                        arrayBuffer: async () =>
                            new TextEncoder().encode(eml).buffer,
                    } as any);
                }

                const { root, waitForChanges } = await render(
                    <limel-file-viewer url={testCase.url}></limel-file-viewer>
                );

                await waitForChanges();
                expect(root).toBeDefined();

                if (testCase.type === 'email') {
                    await waitForChanges();
                    const emailViewer =
                        root?.shadowRoot?.querySelector('limel-email-viewer');
                    expect(emailViewer).toBeTruthy();
                }
            } finally {
                globalThis.fetch = originalFetch;
            }
        });
    }
});

describe('limel-file-viewer email not found', () => {
    it('renders a file-not-found message when the email fails to load', async () => {
        const originalFetch = globalThis.fetch;
        try {
            globalThis.fetch = vi
                .fn()
                .mockRejectedValue(new Error('Not found'));

            const { root, waitForChanges } = await render(
                <limel-file-viewer url="example.eml"></limel-file-viewer>
            );

            await waitForChanges();
            await waitForChanges();

            const emailViewer =
                root?.shadowRoot?.querySelector('limel-email-viewer');
            expect(emailViewer).toBeFalsy();

            const notFound = root?.shadowRoot?.querySelector('div.no-support');
            expect(notFound).toBeTruthy();
        } finally {
            globalThis.fetch = originalFetch;
        }
    });
});

describe('limel-file-viewer officeViewer', () => {
    const testCases = [
        { url: 'example.docx', officeViewer: 'microsoft-office' },
        { url: 'example.docx', officeViewer: 'google-drive' },
        { url: 'example.odp', officeViewer: 'microsoft-office' },
    ];

    for (const testCase of testCases) {
        it(`renders using ${testCase.officeViewer} officeViewer`, async () => {
            const { root } = await render(
                <limel-file-viewer
                    url={testCase.url}
                    officeViewer={testCase.officeViewer}
                ></limel-file-viewer>
            );

            expect(root).toBeDefined();
        });
    }
});
