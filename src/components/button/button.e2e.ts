import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

// Since we are currently using a pre-release of Stencil to get access
// to Puppeteer, documentation is lacking.
//
// Methods and properties for E2EElement (v0.13.0-9):
// https://github.com/ionic-team/stencil/blob/a0250ffcbf5a2c657475a05052eac3a4690809d2/src/testing/puppeteer/puppeteer-declarations.ts#L78
//
// Matchers (expect-methods) for E2EElement (v0.13.0-9):
// https://github.com/ionic-team/stencil/blob/a0250ffcbf5a2c657475a05052eac3a4690809d2/src/declarations/testing.ts#L5

describe('limel-button', () => {
    let page: E2EPage;
    let limelButton: E2EElement;
    let innerButton: E2EElement;

    describe('with a label', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-button label="Save"></limel-button>
            `);
            limelButton = await page.find('limel-button');
            innerButton = await page.find('limel-button>>>button');
        });
        it('displays the correct label', () => {
            expect(innerButton).toEqualText('Save');
        });

        describe('when changing the label', () => {
            beforeEach(async () => {
                limelButton.setProperty('label', 'new label');
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
                    <limel-button label="Save"></limel-button>
                `);
                limelButton = await page.find('limel-button');
                innerButton = await page.find('limel-button>>>button');
            });
            it('is non-primary', () => {
                expect(innerButton).toHaveClass('mdc-button');
                expect(innerButton).not.toHaveClass('mdc-button--unelevated');
            });
            it('the property is falsy', async () => {
                const propValue = await limelButton.getProperty('primary');
                expect(propValue).toBeFalsy();
            });

            describe('when setting the property to `true`', () => {
                beforeEach(async () => {
                    limelButton.setProperty('primary', true);
                    await page.waitForChanges();
                });

                it('is primary', () => {
                    expect(innerButton).toHaveClasses([
                        'mdc-button',
                        'mdc-button--unelevated',
                    ]);
                });
                it('the property is `true`', async () => {
                    const propValue = await limelButton.getProperty('primary');
                    expect(propValue).toBe(true);
                });
            });
        });

        describe('is set', () => {
            beforeEach(async () => {
                page = await createPage(`
                    <limel-button label="Save" primary></limel-button>
                `);
                limelButton = await page.find('limel-button');
                innerButton = await page.find('limel-button>>>button');
            });
            it('is primary', () => {
                expect(innerButton).toHaveClasses([
                    'mdc-button',
                    'mdc-button--unelevated',
                ]);
            });
            it('the property is `true`', async () => {
                const propValue = await limelButton.getProperty('primary');
                expect(propValue).toBe(true);
            });

            describe('when setting the property to `false`', () => {
                beforeEach(async () => {
                    limelButton.setProperty('primary', false);
                    await page.waitForChanges();
                });

                it('is non-primary', () => {
                    expect(innerButton).toHaveClass('mdc-button');
                    expect(innerButton).not.toHaveClass(
                        'mdc-button--unelevated'
                    );
                });
                it('the property is falsy', async () => {
                    const propValue = await limelButton.getProperty('primary');
                    expect(propValue).toBeFalsy();
                });
            });
        });
    });

    describe('when the attribute `disabled`', () => {
        describe('is not set', () => {
            beforeEach(async () => {
                page = await createPage(`
                    <limel-button label="Save"></limel-button>
                `);
                limelButton = await page.find('limel-button');
                innerButton = await page.find('limel-button>>>button');
            });
            it('is enabled', async () => {
                const propValue = await innerButton.getProperty('disabled');
                expect(propValue).toBeFalsy();
            });
            it('the property is falsy', async () => {
                const propValue = await limelButton.getProperty('disabled');
                expect(propValue).toBeFalsy();
            });

            describe('when setting the property to `true`', () => {
                beforeEach(async () => {
                    limelButton.setProperty('disabled', true);
                    await page.waitForChanges();
                });

                it('is disabled', async () => {
                    const propValue = await innerButton.getProperty('disabled');
                    expect(propValue).toBe(true);
                });
                it('the property is `true`', async () => {
                    const propValue = await limelButton.getProperty('disabled');
                    expect(propValue).toBe(true);
                });
            });
        });

        describe('is set', () => {
            beforeEach(async () => {
                page = await createPage(`
                    <limel-button label="Save" disabled></limel-button>
                `);
                limelButton = await page.find('limel-button');
                innerButton = await page.find('limel-button>>>button');
            });
            it('is disabled', async () => {
                const propValue = await innerButton.getProperty('disabled');
                expect(propValue).toBe(true);
            });
            it('the property is `true`', async () => {
                const propValue = await limelButton.getProperty('disabled');
                expect(propValue).toBe(true);
            });

            describe('when setting the property to `false`', () => {
                beforeEach(async () => {
                    limelButton.setProperty('disabled', false);
                    await page.waitForChanges();
                });

                it('is enabled', async () => {
                    const propValue = await innerButton.getProperty('disabled');
                    expect(propValue).toBeFalsy();
                });
                it('the property is falsy', async () => {
                    const propValue = await limelButton.getProperty('disabled');
                    expect(propValue).toBeFalsy();
                });
            });
        });
    });

    describe('when the attribute `loading`', () => {
        describe('is not set', () => {
            beforeEach(async () => {
                page = await createPage(`
                    <limel-button label="Save"></limel-button>
                `);
                limelButton = await page.find('limel-button');
                innerButton = await page.find('limel-button>>>button');
            });
            it('the state is "not loading"', () => {
                expect(innerButton).not.toHaveClass('loading');
                expect(innerButton).not.toHaveClass('just-loaded');
            });
            it('the property is falsy', async () => {
                const propValue = await limelButton.getProperty('loading');
                expect(propValue).toBeFalsy();
            });

            describe('when setting the property to `true`', () => {
                beforeEach(async () => {
                    limelButton.setProperty('loading', true);
                    await page.waitForChanges();
                });
                it('the state is "loading"', () => {
                    expect(innerButton).toHaveClass('loading');
                    expect(innerButton).not.toHaveClass('just-loaded');
                });
                it('the property is `true`', async () => {
                    const propValue = await limelButton.getProperty('loading');
                    expect(propValue).toBe(true);
                });

                describe('and then setting the property to `false`', () => {
                    beforeEach(async () => {
                        limelButton.setProperty('loading', false);
                        await page.waitForChanges();
                    });
                    it('the visual state becomes "just-loaded"', () => {
                        expect(innerButton).not.toHaveClass('loading');
                        expect(innerButton).toHaveClass('just-loaded');
                    });
                    it('the property is falsy', async () => {
                        const propValue = await limelButton.getProperty(
                            'loading'
                        );
                        expect(propValue).toBeFalsy();
                    });
                    describe('after 2 seconds', () => {
                        beforeEach(async () => {
                            await page.waitFor(1900);
                            await page.waitForChanges();
                        });
                        it('the visual state becomes "not loading" after 2 seconds', () => {
                            expect(innerButton).not.toHaveClass('loading');
                            expect(innerButton).not.toHaveClass('just-loaded');
                        });
                    });
                });
            });
        });
        describe('is set', () => {
            beforeEach(async () => {
                page = await createPage(`
                    <limel-button label="Save" loading></limel-button>
                `);
                limelButton = await page.find('limel-button');
                innerButton = await page.find('limel-button>>>button');
            });
            it('the state is "loading"', () => {
                expect(innerButton).toHaveClass('loading');
                expect(innerButton).not.toHaveClass('just-loaded');
            });
            it('the property is `true`', async () => {
                const propValue = await limelButton.getProperty('loading');
                expect(propValue).toBe(true);
            });

            describe('when setting the property to `false`', () => {
                beforeEach(async () => {
                    limelButton.setProperty('loading', false);
                    await page.waitForChanges();
                });
                it('the visual state becomes "just-loaded"', () => {
                    expect(innerButton).not.toHaveClass('loading');
                    expect(innerButton).toHaveClass('just-loaded');
                });
                it('the property is falsy', async () => {
                    const propValue = await limelButton.getProperty('loading');
                    expect(propValue).toBeFalsy();
                });

                describe('after 2 seconds', () => {
                    beforeEach(async () => {
                        await page.waitFor(1900);
                        await page.waitForChanges();
                    });
                    it('the visual state becomes "not loading" after 2 seconds', () => {
                        expect(innerButton).not.toHaveClass('loading');
                        expect(innerButton).not.toHaveClass('just-loaded');
                    });
                });

                describe('and then setting the property to `true`', () => {
                    beforeEach(async () => {
                        page.waitFor(100);
                        limelButton.setProperty('loading', true);
                        await page.waitForChanges();
                    });
                    it('the visual state becomes "loading"', () => {
                        expect(innerButton).toHaveClass('loading');
                        expect(innerButton).not.toHaveClass('just-loaded');
                    });
                    it('the property is `true`', async () => {
                        const propValue = await limelButton.getProperty(
                            'loading'
                        );
                        expect(propValue).toBe(true);
                    });
                });
            });
        });
    });
});

async function createPage(content) {
    return newE2EPage({ html: content });
}
