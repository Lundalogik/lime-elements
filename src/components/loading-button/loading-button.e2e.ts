import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('limel-loading-button', () => {
    let page: E2EPage;
    let limelLoadingButton: E2EElement;
    let innerButton: E2EElement;

    describe('with a label', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-loading-button label="Save"></limel-loading-button>
            `);
            limelLoadingButton = await page.find('limel-loading-button');
            innerButton = await page.find('limel-loading-button>>>button');
        });
        it('displays the correct label', () => {
            expect(innerButton).toEqualText('Save');
        });

        describe('when changing the label', () => {
            beforeEach(async () => {
                limelLoadingButton.setProperty('label', 'new label');
                await page.waitForChanges();
            });
            it('displays the new label', async () => {
                expect(innerButton).toEqualText('new label');
            });
        });
    });

    describe('when the attribute `primary`', () => {
        describe('is not set', () => {
            beforeEach(async () => {
                page = await createPage(`
                    <limel-loading-button label="Save"></limel-loading-button>
                `);
                limelLoadingButton = await page.find('limel-loading-button');
                innerButton = await page.find('limel-loading-button>>>button');
            });
            it('is non-primary', () => {
                expect(innerButton).toHaveClass('mdc-button');
                expect(innerButton).not.toHaveClass('mdc-button--unelevated');
            });
            it('the property is falsy', async () => {
                const propValue = await limelLoadingButton.getProperty(
                    'primary'
                );
                expect(propValue).toBeFalsy();
            });

            describe('when setting the property to `true`', () => {
                beforeEach(async () => {
                    limelLoadingButton.setProperty('primary', true);
                    await page.waitForChanges();
                });

                it('is primary', () => {
                    expect(innerButton).toHaveClasses([
                        'mdc-button',
                        'mdc-button--unelevated',
                    ]);
                });
                it('the property is `true`', async () => {
                    const propValue = await limelLoadingButton.getProperty(
                        'primary'
                    );
                    expect(propValue).toBe(true);
                });
            });
        });

        describe('is set', () => {
            beforeEach(async () => {
                page = await createPage(`
                    <limel-loading-button label="Save" primary></limel-loading-button>
                `);
                limelLoadingButton = await page.find('limel-loading-button');
                innerButton = await page.find('limel-loading-button>>>button');
            });
            it('is primary', () => {
                expect(innerButton).toHaveClasses([
                    'mdc-button',
                    'mdc-button--unelevated',
                ]);
            });
            it('the property is `true`', async () => {
                const propValue = await limelLoadingButton.getProperty(
                    'primary'
                );
                expect(propValue).toBe(true);
            });

            describe('when setting the property to `false`', () => {
                beforeEach(async () => {
                    limelLoadingButton.setProperty('primary', false);
                    await page.waitForChanges();
                });

                it('is non-primary', () => {
                    expect(innerButton).toHaveClass('mdc-button');
                    expect(innerButton).not.toHaveClass(
                        'mdc-button--unelevated'
                    );
                });
                it('the property is falsy', async () => {
                    const propValue = await limelLoadingButton.getProperty(
                        'primary'
                    );
                    expect(propValue).toBeFalsy();
                });
            });
        });
    });

    describe('when the attribute `disabled`', () => {
        describe('is not set', () => {
            beforeEach(async () => {
                page = await createPage(`
                    <limel-loading-button label="Save"></limel-loading-button>
                `);
                limelLoadingButton = await page.find('limel-loading-button');
                innerButton = await page.find('limel-loading-button>>>button');
            });
            it('is enabled', async () => {
                const propValue = await innerButton.getProperty('disabled');
                expect(propValue).toBeFalsy();
            });
            it('the property is falsy', async () => {
                const propValue = await limelLoadingButton.getProperty(
                    'disabled'
                );
                expect(propValue).toBeFalsy();
            });

            describe('when setting the property to `true`', () => {
                beforeEach(async () => {
                    limelLoadingButton.setProperty('disabled', true);
                    await page.waitForChanges();
                });

                it('is disabled', async () => {
                    const propValue = await innerButton.getProperty('disabled');
                    expect(propValue).toBe(true);
                });
                it('the property is `true`', async () => {
                    const propValue = await limelLoadingButton.getProperty(
                        'disabled'
                    );
                    expect(propValue).toBe(true);
                });
            });
        });

        describe('is set', () => {
            beforeEach(async () => {
                page = await createPage(`
                    <limel-loading-button label="Save" disabled></limel-loading-button>
                `);
                limelLoadingButton = await page.find('limel-loading-button');
                innerButton = await page.find('limel-loading-button>>>button');
            });
            it('is disabled', async () => {
                const propValue = await innerButton.getProperty('disabled');
                expect(propValue).toBe(true);
            });
            it('the property is `true`', async () => {
                const propValue = await limelLoadingButton.getProperty(
                    'disabled'
                );
                expect(propValue).toBe(true);
            });

            describe('when setting the property to `false`', () => {
                beforeEach(async () => {
                    limelLoadingButton.setProperty('disabled', false);
                    await page.waitForChanges();
                });

                it('is enabled', async () => {
                    const propValue = await innerButton.getProperty('disabled');
                    expect(propValue).toBeFalsy();
                });
                it('the property is falsy', async () => {
                    const propValue = await limelLoadingButton.getProperty(
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
