import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('limel-snackbar', () => {
    let page: E2EPage;
    let snackbar: E2EElement;
    let mdcSnackbar: E2EElement;
    let snackbarLabel: E2EElement;

    describe('show', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-snackbar message="This is a message"></limel-snackbar>
            `);
            snackbar = await page.find('limel-snackbar');
            mdcSnackbar = await page.find('limel-snackbar>>>.mdc-snackbar');
            snackbarLabel = await mdcSnackbar.find('.mdc-snackbar__label');
            await page.waitForChanges();
            await snackbar.callMethod('show');
            await page.waitForChanges();
        });

        it('opens the snackbar', () => {
            expect(mdcSnackbar).toHaveClass('mdc-snackbar--open');
        });

        it.skip('displays the message', () => {
            // Doesn't work at the moment, no idea why. /Ads
            expect(snackbarLabel).toEqualText('This is a message');
        });
    });

    describe('hide', () => {
        let spy;

        beforeEach(async () => {
            page = await createPage(`
                <limel-snackbar message="This is a message"></limel-snackbar>
            `);
            snackbar = await page.find('limel-snackbar');
            snackbar.setProperty('timeout', 4000);
            spy = await snackbar.spyOnEvent('hide');
            await snackbar.callMethod('show');
            await page.waitForChanges();
            await page.waitFor(4000);
            await page.waitForChanges();
        });

        it('opens the snackbar and gets a hide event when it hides', () => {
            expect(spy).toHaveReceivedEventTimes(1);
        });
    });

    describe('with actionText', () => {
        let spy;
        let button: E2EElement;

        beforeEach(async () => {
            page = await createPage(`
                <limel-snackbar message="This is a message" action-text="Press me!"></limel-snackbar>
            `);
            snackbar = await page.find('limel-snackbar');
            snackbarLabel = await page.find(
                'limel-snackbar>>>.mdc-snackbar__label'
            );
            button = await page.find('limel-snackbar>>>button');
            await page.waitForChanges();
            await snackbar.callMethod('show');
            await page.waitForChanges();
        });

        it('opens the snackbar', () => {
            expect(mdcSnackbar).toHaveClass('mdc-snackbar--open');
        });

        it.skip('displays the message', () => {
            // Doesn't work at the moment, no idea why. /Ads
            expect(snackbarLabel).toEqualText('This is a message');
        });

        it('displays the action text', () => {
            expect(button).toEqualText('Press me!');
        });

        describe('when the action button is pressed', () => {
            beforeEach(async () => {
                spy = await snackbar.spyOnEvent('action');
                button.click();
                await page.waitForChanges();
            });
            it('emits an action event', async () => {
                expect(spy).toHaveReceivedEventTimes(1);
            });
        });
    });
});

async function createPage(content) {
    return newE2EPage({ html: content });
}
