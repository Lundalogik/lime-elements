import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('limel-shortcut', () => {
    let page: E2EPage;
    let limelShortcut: E2EElement;
    let link: E2EElement;
    let label: E2EElement;
    let badge: E2EElement;

    describe('with a label', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-shortcut label="iSpiffy"></limel-shortcut>
            `);
            limelShortcut = await page.find('limel-shortcut');
            link = await page.find('limel-shortcut >>> a');
            label = await page.find('limel-shortcut >>> span');
        });
        it('displays the correct label', () => {
            expect(label).toEqualText('iSpiffy');
        });
        it('includes the label in `aria-label`', () => {
            expect(link).toEqualAttribute('aria-label', 'iSpiffy');
        });

        describe('when changing the label', () => {
            beforeEach(async () => {
                limelShortcut.setProperty('label', 'imTired');
                await page.waitForChanges();
            });
            it('displays the new label', async () => {
                expect(label).toEqualText('imTired');
            });
            it('updates `aria-label`', () => {
                expect(link).toEqualAttribute('aria-label', 'imTired');
            });
        });
    });

    describe('with `link` `title`', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-shortcut></limel-shortcut>
            `);
            limelShortcut = await page.find('limel-shortcut');
            limelShortcut.setProperty('link', {
                title: 'Open the iSpiffy app',
            });
            await page.waitForChanges();
            link = await page.find('limel-shortcut >>> a');
            label = await page.find('limel-shortcut >>> span');
        });
        it('sets the `title` attribute on the `link`', () => {
            expect(link).toEqualAttribute('title', 'Open the iSpiffy app');
        });
        it('includes the `title` in `aria-label`', () => {
            expect(link).toEqualAttribute('aria-label', 'Open the iSpiffy app');
        });

        describe('when changing the `link` `title`', () => {
            beforeEach(async () => {
                limelShortcut.setProperty('link', {
                    title: 'I need a cup of tea',
                });
                await page.waitForChanges();
            });
            it('uses the new `title`', async () => {
                expect(link).toEqualAttribute('title', 'I need a cup of tea');
            });
            it('updates `aria-label`', () => {
                expect(link).toEqualAttribute(
                    'aria-label',
                    'I need a cup of tea'
                );
            });
        });
    });

    describe('with a label and a `link` `title`', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-shortcut label="iSpiffy"></limel-shortcut>
            `);
            limelShortcut = await page.find('limel-shortcut');
            limelShortcut.setProperty('link', {
                title: 'Open the iSpiffy app',
            });
            await page.waitForChanges();
            link = await page.find('limel-shortcut >>> a');
            label = await page.find('limel-shortcut >>> span');
        });
        it('displays the correct `label`', () => {
            expect(label).toEqualText('iSpiffy');
        });
        it('uses both the `label` and the `link` `title` to construct the `aria-label`', () => {
            expect(link).toEqualAttribute(
                'aria-label',
                'iSpiffy. Open the iSpiffy app'
            );
        });

        describe('when changing the `label`', () => {
            beforeEach(async () => {
                limelShortcut.setProperty('label', 'imTired');
                await page.waitForChanges();
            });
            it('updates `aria-label`', () => {
                expect(link).toEqualAttribute(
                    'aria-label',
                    'imTired. Open the iSpiffy app'
                );
            });
        });

        describe('when changing the `link` `title`', () => {
            beforeEach(async () => {
                limelShortcut.setProperty('link', {
                    title: 'I need a cup of tea',
                });
                await page.waitForChanges();
            });
            it('updates `aria-label`', () => {
                expect(link).toEqualAttribute(
                    'aria-label',
                    'iSpiffy. I need a cup of tea'
                );
            });
        });
    });

    describe('with a value for badge', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-shortcut badge="NEW"></limel-shortcut>
            `);
            limelShortcut = await page.find('limel-shortcut');
            badge = await page.find('limel-shortcut >>> limel-badge');
        });
        it('displays a badge with the correct value', () => {
            expect(badge).toEqualAttribute('label', 'NEW');
        });

        describe('when changing the badge value', () => {
            beforeEach(async () => {
                limelShortcut.setProperty('badge', '3');
                await page.waitForChanges();
            });
            it('displays the new badge value', async () => {
                expect(badge).toEqualAttribute('label', '3');
            });
        });
    });
});

async function createPage(content) {
    return newE2EPage({ html: content });
}
