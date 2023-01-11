import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('limel-info-tile', () => {
    let page: E2EPage;
    describe('smoke test', () => {
        let value: E2EElement;
        beforeEach(async () => {
            page = await createPage(`
                <limel-info-tile value="Test value"></limel-info-tile>
            `);
            value = await page.find('limel-info-tile >>> .value-group');
        });
        it('displays the correct value', () => {
            expect(value).toEqualText('Test value');
        });
    });

    describe('when value is empty', () => {
        let label: E2EElement;
        beforeEach(async () => {
            page = await createPage(`
                <limel-info-tile label="Test label"></limel-info-tile>
            `);
            label = await page.find('limel-info-tile >>> .label');
        });
        it('does not crash', () => {
            expect(label).toEqualText('Test label');
        });
    });
});

async function createPage(content) {
    return newE2EPage({ html: content });
}

// What kinds of tests can we write:

// - component is rendered with a `label`, `value` and an `icon`
// - `value` and `label` are reflected in `aria-label` on the `a`

// - component is rendered with a `label`, `value`, `prefix` and `suffix`
// - `value`, `label`, `prefix` and `suffix` are reflected in `aria-label` on the `a`

// - the link can get an `href` class
// - `is-clickable` class is applied when there is a `href`

// - component can have a `badge` with numeric or string value

// - component can show a circular progress bar, when `progressValue` is defined
