import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('limel-helper-line', () => {
    let page: E2EPage;
    let limelHelperLine: E2EElement;
    let helperText: E2EElement;
    let counter: E2EElement;

    describe('renders when given valid props', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-helper-line
                    helper-text="Help"
                    length="10"
                    max-length="20"
                    helper-text-id="Identify"
                    invalid="true"
                >
                </limel-helper-line>
            `);
            limelHelperLine = await page.find('limel-helper-line');
            helperText = await page.find('limel-helper-line >>> .helper-text');
            counter = await page.find('limel-helper-line >>> .counter');
        });
        it('displays the correct helper text', () => {
            expect(helperText).toEqualText('Help');
        });
        it('displays correct counter', () => {
            expect(counter).toEqualText('10 / 20');
        });
        it('the component gets the correct id', () => {
            expect(helperText).toEqualAttribute('id', 'Identify');
        });
        it('the component gets the `invalid` class', () => {
            expect(limelHelperLine).toHaveClass('invalid');
        });

        describe('when changing the `length`, the counter is updated', () => {
            beforeEach(async () => {
                limelHelperLine.setProperty('length', '12');
                await page.waitForChanges();
            });
            it('displays the new counter', async () => {
                expect(counter).toEqualText('12 / 20');
            });
        });
    });
});

async function createPage(content) {
    return newE2EPage({ html: content });
}
