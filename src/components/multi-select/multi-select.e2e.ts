import { newE2EPage } from '@stencil/core/testing';
import { Option } from '../select/option';

// We get access to Puppeteer though Stencil, but the documentation is lacking.
//
// Methods and properties for E2EElement (v0.13.2):
// https://github.com/ionic-team/stencil/blob/a0250ffcbf5a2c657475a05052eac3a4690809d2/src/testing/puppeteer/puppeteer-declarations.ts#L78
//
// Matchers (expect-methods) for E2EElement (v0.13.2):
// https://github.com/ionic-team/stencil/blob/a0250ffcbf5a2c657475a05052eac3a4690809d2/src/declarations/testing.ts#L5

describe('limel-multi-select', () => {
    let page;
    describe('with a label', () => {
        let limelMultiSelect;
        let label;
        beforeEach(async () => {
            page = await createPage(`
                <limel-multi-select label="Favourite Doctors"></limel-multi-select>
            `);
            limelMultiSelect = await page.find('limel-multi-select');
            label = await page.find('limel-multi-select>>>.multi-select-label');
        });
        it('displays the correct label', () => {
            expect(label).toEqualText('Favourite Doctors');
        });

        describe('when changing the label', () => {
            beforeEach(async () => {
                limelMultiSelect.setProperty('label', 'new label');
                await page.waitForChanges();
            });
            it('displays the new label', async () => {
                expect(label).toEqualText('new label');
            });
        });
    });

    describe('when the attribute `disabled`', () => {
        describe('is not set', () => {
            let limelMultiSelect;
            let mdcCheckboxes;
            let innerCheckboxes;
            beforeEach(async () => {
                const { options, value } = setupTestData();
                page = await createPage(`
                    <limel-multi-select label="Favourite Doctors"></limel-multi-select>
                `);
                limelMultiSelect = await page.find('limel-multi-select');
                await limelMultiSelect.setProperty('options', options);
                await limelMultiSelect.setProperty('value', value);
                await page.waitForChanges();
                mdcCheckboxes = await page.findAll(
                    'limel-multi-select >>> .mdc-checkbox'
                );
                innerCheckboxes = await page.findAll(
                    'limel-multi-select >>> input[type=checkbox]'
                );
            });
            it('is enabled', () => {
                checkboxesEnabled(mdcCheckboxes, innerCheckboxes);
            });
            it('the property is falsy', async () => {
                const propValue = await limelMultiSelect.getProperty(
                    'disabled'
                );
                expect(propValue).toBeFalsy();
            });

            describe('when then set to `true`', () => {
                beforeEach(async () => {
                    await limelMultiSelect.setProperty('disabled', true);
                    await page.waitForChanges();
                });
                it('is disabled', () => {
                    checkboxesDisabled(mdcCheckboxes, innerCheckboxes);
                });
                it('the property is `true`', async () => {
                    const propValue = await limelMultiSelect.getProperty(
                        'disabled'
                    );
                    expect(propValue).toEqual(true);
                });
            });
        });

        describe('is set to `false`', () => {
            let limelMultiSelect;
            let mdcCheckboxes;
            let innerCheckboxes;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-multi-select label="Favourite Doctors" disabled="false"></limel-multi-select>
                `);
                limelMultiSelect = await page.find('limel-multi-select');
                mdcCheckboxes = await page.findAll(
                    'limel-multi-select >>> .mdc-checkbox'
                );
                innerCheckboxes = await page.findAll(
                    'limel-multi-select >>> input[type=checkbox]'
                );
            });
            it('is enabled', () => {
                checkboxesEnabled(mdcCheckboxes, innerCheckboxes);
            });
            it('the property is falsy', async () => {
                const propValue = await limelMultiSelect.getProperty(
                    'disabled'
                );
                expect(propValue).toBeFalsy();
            });

            describe('when then set to `true`', () => {
                beforeEach(async () => {
                    await limelMultiSelect.setProperty('disabled', true);
                    await page.waitForChanges();
                });
                it('is disabled', () => {
                    checkboxesDisabled(mdcCheckboxes, innerCheckboxes);
                });
                it('the property is `true`', async () => {
                    const propValue = await limelMultiSelect.getProperty(
                        'disabled'
                    );
                    expect(propValue).toEqual(true);
                });
            });
        });

        describe('is set to `true`', () => {
            let limelMultiSelect;
            let mdcCheckboxes;
            let innerCheckboxes;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-multi-select label="Favourite Doctors" disabled="true"></limel-multi-select>
                `);
                limelMultiSelect = await page.find('limel-multi-select');
                mdcCheckboxes = await page.findAll(
                    'limel-multi-select>>>.mdc-checkbox'
                );
                innerCheckboxes = await page.findAll(
                    'limel-multi-select>>>input[type=checkbox]'
                );
            });
            it('is disabled', () => {
                checkboxesDisabled(mdcCheckboxes, innerCheckboxes);
            });
            it('the property is `true`', async () => {
                const propValue = await limelMultiSelect.getProperty(
                    'disabled'
                );
                expect(propValue).toEqual(true);
            });

            describe('when then set to `false`', () => {
                beforeEach(async () => {
                    await limelMultiSelect.setProperty('disabled', false);
                    await page.waitForChanges();
                });
                it('is enabled', () => {
                    checkboxesEnabled(mdcCheckboxes, innerCheckboxes);
                });
                it('the property is falsy', async () => {
                    const propValue = await limelMultiSelect.getProperty(
                        'disabled'
                    );
                    expect(propValue).toBeFalsy();
                });
            });
        });
    });
});

async function createPage(content) {
    return newE2EPage({ html: content });
}

function setupTestData() {
    const options: Option[] = [
        { text: 'Luke Skywalker', value: 'luke' },
        { text: 'Han Solo', value: 'han' },
        { text: 'Leia Organo', value: 'leia' },
    ];
    const value: Option[] = [{ text: 'Han Solo', value: 'han' }];
    return { options: options, value: value };
}

function checkboxesEnabled(mdcCheckboxes, innerCheckboxes) {
    mdcCheckboxes.forEach(mdcCheckbox => {
        expect(mdcCheckbox).not.toHaveClass('mdc-checkbox--disabled');
    });
    innerCheckboxes.forEach(innerCheckbox => {
        expect(innerCheckbox).not.toHaveAttribute('disabled');
    });
}

function checkboxesDisabled(mdcCheckboxes, innerCheckboxes) {
    mdcCheckboxes.forEach(mdcCheckbox => {
        expect(mdcCheckbox).toHaveClass('mdc-checkbox--disabled');
    });
    innerCheckboxes.forEach(innerCheckbox => {
        expect(innerCheckbox).toHaveAttribute('disabled');
    });
}
