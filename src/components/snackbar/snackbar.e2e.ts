import {
    E2EElement,
    E2EPage,
    EventSpy,
    newE2EPage,
} from '@stencil/core/testing';

describe('limel-snackbar', () => {
    let page: E2EPage;
    let snackbar: E2EElement;
    let popover: E2EElement;
    let snackbarLabel: E2EElement;

    beforeEach(() => {});

    describe('show', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-snackbar message="This is a message"></limel-snackbar>
            `);
            snackbar = await page.find('limel-snackbar');
            popover = await page.find('limel-snackbar>>>[popover]');
            await page.waitForChanges();
            await snackbar.callMethod('show');
            await page.waitForChanges();
        });

        it('opens the snackbar', () => {
            expect(popover).toHaveClass('open');
        });

        it('displays the message', async () => {
            snackbarLabel = await popover.find('.label');
            expect(snackbarLabel).toEqualText('This is a message');
        });
    });

    describe('hide', () => {
        let spy: EventSpy;

        beforeEach(async () => {
            page = await createPage(`
                <limel-snackbar message="This is a message"></limel-snackbar>
            `);
            snackbar = await page.find('limel-snackbar');
            snackbar.setProperty('timeout', 4000);
            spy = await snackbar.spyOnEvent('hide');
            await snackbar.callMethod('show');
            await page.waitForEvent('hide');
        });

        it('opens the snackbar and gets a hide event when it hides', () => {
            expect(spy).toHaveReceivedEventTimes(1);
        });
    });

    describe('with actionText', () => {
        let spy: EventSpy;
        let button: E2EElement;

        beforeEach(async () => {
            page = await createPage(`
                <limel-snackbar message="This is a message" action-text="Press me!"></limel-snackbar>
            `);
            snackbar = await page.find('limel-snackbar');
            popover = await page.find('limel-snackbar>>>[popover]');
            button = await page.find('limel-snackbar>>>limel-button');
            await page.waitForChanges();
            await snackbar.callMethod('show');
            await page.waitForChanges();
        });

        it('opens the snackbar', () => {
            expect(popover).toHaveClass('open');
        });

        it('displays the message', async () => {
            snackbarLabel = await popover.find('.label');
            expect(snackbarLabel).toEqualText('This is a message');
        });

        it('displays the action text', async () => {
            expect(button.getAttribute('label')).toEqualText('Press me!');
        });

        describe('when the action button is pressed', () => {
            beforeEach(async () => {
                spy = await snackbar.spyOnEvent('action');
                button.click();
                await page.waitForEvent('action');
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
