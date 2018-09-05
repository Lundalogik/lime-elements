import { newE2EPage } from '@stencil/core/testing';

describe('limel-button', async () => {
    let page;
    beforeEach(async () => {
        page = await newE2EPage();
    });

    describe('with a label', () => {
        let limelButton;
        let innerButton;
        beforeEach(async () => {
            await page.setContent(`
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
            let limelButton;
            let innerButton;
            beforeEach(async () => {
                await page.setContent(`
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
            let limelButton;
            let innerButton;
            beforeEach(async () => {
                await page.setContent(`
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
            let limelButton;
            let innerButton;
            beforeEach(async () => {
                await page.setContent(`
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
            let limelButton;
            let innerButton;
            beforeEach(async () => {
                await page.setContent(`
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
            let limelButton;
            let innerButton;
            beforeEach(async () => {
                await page.setContent(`
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
                            await page.waitFor(2500);
                        });
                        it.skip('the visual state becomes "not loading" after 2 seconds', () => {
                            expect(innerButton).not.toHaveClass('loading');
                            expect(innerButton).not.toHaveClass('just-loaded');
                        });
                    });
                });
            });
        });
        describe('is set', () => {
            let limelButton;
            let innerButton;
            beforeEach(async () => {
                await page.setContent(`
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
                        await page.waitFor(2500);
                    });
                    it.skip('the visual state becomes "not loading" after 2 seconds', () => {
                        expect(innerButton).not.toHaveClass('loading');
                        expect(innerButton).not.toHaveClass('just-loaded');
                    });
                });

                describe('and then setting the property to `true`', () => {
                    beforeEach(async () => {
                        limelButton.setProperty('loading', true);
                        await page.waitForChanges();
                    });
                    it.skip('the visual state becomes "loading"', () => {
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
