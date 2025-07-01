import { newE2EPage } from '@stencil/core/testing';

describe('limel-icon-button', () => {
    let page;
    describe('smoke test', () => {
        let mdcIconButton;
        beforeEach(async () => {
            page = await createPage(`
                <limel-icon-button icon="unit-test" label="Add favorite"></limel-icon-button>
            `);
            mdcIconButton = await page.find(
                'limel-icon-button >>> limel-tooltip'
            );
        });
        it('displays the correct label', () => {
            expect(mdcIconButton).toEqualAttribute('label', 'Add favorite');
        });
    });
});

async function createPage(content) {
    return newE2EPage({ html: content });
}
