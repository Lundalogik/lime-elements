import { render, h } from '@stencil/vitest';

describe('limel-file-viewer', () => {
    // The old e2e tests relied on Puppeteer serving static files (images, PDFs, etc.)
    // from the filesystem. The Stencil vitest render doesn't serve files,
    // so we test rendering logic based on URL extension detection.

    describe('with image URL', () => {
        it('renders an img element', async () => {
            const { root, waitForChanges } = await render(
                <limel-file-viewer url="/assets/test.gif"></limel-file-viewer>
            );
            await waitForChanges();

            const img = root.shadowRoot.querySelector('img');
            expect(img).toBeTruthy();
            expect(img.getAttribute('src')).toContain('/assets/test.gif');
        });

        it('shows button controls', async () => {
            const { root, waitForChanges } = await render(
                <limel-file-viewer url="/assets/test.gif"></limel-file-viewer>
            );
            await waitForChanges();

            const buttons = root.shadowRoot.querySelector('div.buttons');
            expect(buttons).toBeTruthy();
        });
    });

    describe('with pdf URL', () => {
        it('renders an iframe element', async () => {
            const { root, waitForChanges } = await render(
                <limel-file-viewer url="/assets/file.pdf"></limel-file-viewer>
            );
            await waitForChanges();

            const iframe = root.shadowRoot.querySelector('iframe');
            expect(iframe).toBeTruthy();
        });

        it('does not show button controls', async () => {
            const { root, waitForChanges } = await render(
                <limel-file-viewer url="/assets/file.pdf"></limel-file-viewer>
            );
            await waitForChanges();

            const buttons = root.shadowRoot.querySelector('div.buttons');
            expect(buttons).toBeNull();
        });
    });

    describe('with text URL', () => {
        it('renders an object element', async () => {
            const { root, waitForChanges } = await render(
                <limel-file-viewer url="/assets/file.txt"></limel-file-viewer>
            );
            await waitForChanges();

            const obj = root.shadowRoot.querySelector('object');
            expect(obj).toBeTruthy();
            expect(obj.getAttribute('data')).toContain('/assets/file.txt');
        });
    });

    describe('with video URL', () => {
        it('renders a video element', async () => {
            const { root, waitForChanges } = await render(
                <limel-file-viewer url="/assets/video.mkv"></limel-file-viewer>
            );
            await waitForChanges();

            const video = root.shadowRoot.querySelector('video');
            expect(video).toBeTruthy();
        });
    });

    describe('with audio URL', () => {
        it('renders an audio element', async () => {
            const { root, waitForChanges } = await render(
                <limel-file-viewer url="/assets/audio.mp3"></limel-file-viewer>
            );
            await waitForChanges();

            const audio = root.shadowRoot.querySelector('audio');
            expect(audio).toBeTruthy();
        });
    });
});
