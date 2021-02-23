import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

// Since we are currently using a pre-release of Stencil to get access
// to Puppeteer, documentation is lacking.
//
// Methods and properties for E2EElement (v0.13.0-9):
// https://github.com/ionic-team/stencil/blob/a0250ffcbf5a2c657475a05052eac3a4690809d2/src/testing/puppeteer/puppeteer-declarations.ts#L78
//
// Matchers (expect-methods) for E2EElement (v0.13.0-9):
// https://github.com/ionic-team/stencil/blob/a0250ffcbf5a2c657475a05052eac3a4690809d2/src/declarations/testing.ts#L5

describe('limel-file-viewer', () => {
    let page: E2EPage;
    let contentElement: E2EElement;

    describe('with image', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-file-viewer url="cat.gif"></limel-file-viewer>
            `);
            contentElement = await page.find('limel-file-viewer>>>img');
        });
        it('displays the image given by url', () => {
            expect(contentElement.getAttribute('src')).toEqualText('cat.gif');
        });
        it('shows button controls', async () => {
            const buttons = await page.find('limel-file-viewer>>>div.buttons');
            expect(buttons).toBeDefined();
        });
        it.skip('removes the image when url is cleared', async () => {
            await page.$eval('limel-file-viewer', (el: any) => {
                el.url = '';
            });
            await page.waitForChanges();

            contentElement = await page.find('limel-file-viewer>>>img');

            expect(contentElement).toBeNull();
        });
    });

    describe('with pdf', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-file-viewer url="file.pdf"></limel-file-viewer>
            `);
            contentElement = await page.find('limel-file-viewer>>>object');
        });
        it('displays the pdf using the object element', () => {
            expect(contentElement.getAttribute('data')).toEqualText('file.pdf');
        });
        it('does not show button controls', async () => {
            const buttons = await page.find('limel-file-viewer>>>div.buttons');
            expect(buttons).toBeNull();
        });
        it('has file not supported text as fallback', async () => {
            const noSupportMessage = await contentElement.find('.no-support');
            expect(noSupportMessage).toBeDefined();
        });
    });

    describe('with text', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-file-viewer url="file.txt"></limel-file-viewer>
            `);
            contentElement = await page.find('limel-file-viewer>>>object');
        });
        it('displays the text file using the object element', () => {
            expect(contentElement.getAttribute('data')).toEqualText('file.txt');
        });
        it('shows button controls', async () => {
            const buttons = await page.find('limel-file-viewer>>>div.buttons');
            expect(buttons).toBeDefined();
        });
        it('has file not supported text as fallback', async () => {
            const noSupportMessage = await contentElement.find('.no-support');
            expect(noSupportMessage).toBeDefined();
        });
    });

    describe('with video', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-file-viewer url="file.mkv"></limel-file-viewer>
            `);
            contentElement = await page.find('limel-file-viewer>>>video');
        });
        it('displays the video using the video element', async () => {
            const sourceElement = await contentElement.find('source');
            expect(sourceElement.getAttribute('src')).toEqualText('file.mkv');
        });
        it('does not show button controls', async () => {
            const buttons = await page.find('limel-file-viewer>>>div.buttons');
            expect(buttons).toBeNull();
        });
        it('has file not supported text as fallback', async () => {
            const noSupportMessage = await contentElement.find('.no-support');
            expect(noSupportMessage).toBeDefined();
        });
    });

    describe('with audio', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-file-viewer url="file.mp3"></limel-file-viewer>
            `);
            contentElement = await page.find('limel-file-viewer>>>audio');
        });
        it('displays the audio using the audio element', async () => {
            const sourceElement = await contentElement.find('source');
            expect(sourceElement.getAttribute('src')).toEqualText('file.mp3');
        });
        it('does not show button controls', async () => {
            const buttons = await page.find('limel-file-viewer>>>div.buttons');
            expect(buttons).toBeNull();
        });
        it('has file not supported text as fallback', async () => {
            const noSupportMessage = await contentElement.find('.no-support');
            expect(noSupportMessage).toBeDefined();
        });
    });

    describe('without url', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-file-viewer></limel-file-viewer>
            `);
            contentElement = await page.find('limel-file-viewer>>>*');
        });
        it.skip('shows nothing', () => {
            expect(contentElement).toBeNull();
        });
    });
});

async function createPage(content) {
    return newE2EPage({ html: content });
}
