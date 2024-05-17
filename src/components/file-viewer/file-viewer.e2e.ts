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
                <limel-file-viewer url="/assets/misc-files/service-pnp-pga-07100-07149_150px.gif"></limel-file-viewer>
            `);
            contentElement = await page.find('limel-file-viewer>>>img');
        });
        it('displays the image given by url', () => {
            expect(contentElement.getAttribute('src')).toEqualText(
                '/assets/misc-files/service-pnp-pga-07100-07149_150px.gif',
            );
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
                <limel-file-viewer url="/assets/misc-files/file.pdf"></limel-file-viewer>
            `);
            contentElement = await page.find('limel-file-viewer>>>iframe');
        });
        it('displays the pdf using the iframe element', () => {
            expect(contentElement.getAttribute('src')).toContain('blob:');
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
                <limel-file-viewer url="/assets/misc-files/file.txt"></limel-file-viewer>
            `);
            contentElement = await page.find('limel-file-viewer>>>object');
        });
        it('displays the text file using the object element', () => {
            expect(contentElement.getAttribute('data')).toEqualText(
                '/assets/misc-files/file.txt',
            );
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
            // We have no .mkv file, and I couldn't get the the server used for
            // the tests to serve .mkv files anyway, so we just mock
            // console.error to avoid the error message in the test output.
            jest.spyOn(console, 'error').mockImplementation(() => {});
            page = await createPage(`
                <limel-file-viewer url="/assets/misc-files/20736707-sd_426_240_30fps.mkv"></limel-file-viewer>
            `);
            contentElement = await page.find('limel-file-viewer>>>video');
            jest.restoreAllMocks();
        });
        it('displays the video using the video element', async () => {
            const sourceElement = await contentElement.find('source');
            expect(sourceElement.getAttribute('src')).toEqualText(
                '/assets/misc-files/20736707-sd_426_240_30fps.mkv',
            );
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
                <limel-file-viewer url="/assets/misc-files/Gorilla-SoundBible.com-1576451741.mp3"></limel-file-viewer>
            `);

            contentElement = await page.find('limel-file-viewer>>>audio');
        });
        it('displays the audio using the audio element', async () => {
            const sourceElement = await contentElement.find('source');
            expect(sourceElement.getAttribute('src')).toEqualText(
                '/assets/misc-files/Gorilla-SoundBible.com-1576451741.mp3',
            );
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
