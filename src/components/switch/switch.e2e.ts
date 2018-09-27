import { newE2EPage } from '@stencil/core/testing';

// Since we are currently using a pre-release of Stencil to get access
// to Puppeteer, documentation is lacking.
//
// Methods and properties for E2EElement (v0.13.0-9):
// https://github.com/ionic-team/stencil/blob/a0250ffcbf5a2c657475a05052eac3a4690809d2/src/testing/puppeteer/puppeteer-declarations.ts#L78
//
// Matchers (expect-methods) for E2EElement (v0.13.0-9):
// https://github.com/ionic-team/stencil/blob/a0250ffcbf5a2c657475a05052eac3a4690809d2/src/declarations/testing.ts#L5

describe('limel-switch', async () => {
    let page;
    describe('with a label', () => {
        let limelSwitch;
        let label;
        beforeEach(async () => {
            page = await createPage(`
                <limel-switch label="Active"></limel-switch>
            `);
            limelSwitch = await page.find('limel-switch');
            label = await page.find('limel-switch>>>label');
        });
        it('displays the correct label', () => {
            expect(label).toEqualText('Active');
        });

        describe('when changing the label', () => {
            beforeEach(async () => {
                limelSwitch.setProperty('label', 'new label');
                await page.waitForChanges();
            });
            it('displays the new label', async () => {
                expect(label).toEqualText('new label');
            });
        });
    });

    describe('when the attribute `value`', () => {
        describe('is not set', () => {
            let limelSwitch;
            let mdcSwitch;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-switch label="Active"></limel-switch>
                `);
                limelSwitch = await page.find('limel-switch');
                mdcSwitch = await page.find('limel-switch>>>.mdc-switch');
            });
            it('is "off"', () => {
                expect(mdcSwitch).not.toHaveClass('mdc-switch--checked');
            });
            it('the property is falsy', async () => {
                const propValue = await limelSwitch.getProperty('value');
                expect(propValue).toBeFalsy();
            });

            describe('when then set to `true`', () => {
                beforeEach(async () => {
                    limelSwitch.setProperty('value', true);
                    await page.waitForChanges();
                });
                it('is "on"', () => {
                    expect(mdcSwitch).toHaveClass('mdc-switch--checked');
                });
                it('the property is `true`', async () => {
                    const propValue = await limelSwitch.getProperty('value');
                    expect(propValue).toEqual(true);
                });
            });
        });

        describe('is set to `false`', () => {
            let limelSwitch;
            let mdcSwitch;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-switch label="Active" value="false"></limel-switch>
                `);
                limelSwitch = await page.find('limel-switch');
                mdcSwitch = await page.find('limel-switch>>>.mdc-switch');
            });
            it('is "off"', () => {
                expect(mdcSwitch).not.toHaveClass('mdc-switch--checked');
            });
            it('the property is falsy', async () => {
                const propValue = await limelSwitch.getProperty('value');
                expect(propValue).toBeFalsy();
            });

            describe('when then set to `true`', () => {
                beforeEach(async () => {
                    limelSwitch.setProperty('value', true);
                    await page.waitForChanges();
                });
                it('is "on"', () => {
                    expect(mdcSwitch).toHaveClass('mdc-switch--checked');
                });
                it('the property is `true`', async () => {
                    const propValue = await limelSwitch.getProperty('value');
                    expect(propValue).toEqual(true);
                });
            });
        });

        describe('is set to `true`', () => {
            let limelSwitch;
            let mdcSwitch;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-switch label="Active" value="true"></limel-switch>
                `);
                limelSwitch = await page.find('limel-switch');
                mdcSwitch = await page.find('limel-switch>>>.mdc-switch');
            });
            it('is "on"', () => {
                expect(mdcSwitch).toHaveClass('mdc-switch--checked');
            });
            it('the property is `true`', async () => {
                const propValue = await limelSwitch.getProperty('value');
                expect(propValue).toEqual(true);
            });

            describe('when then set to `false`', () => {
                beforeEach(async () => {
                    limelSwitch.setProperty('value', false);
                    await page.waitForChanges();
                });
                it('is "off"', () => {
                    expect(mdcSwitch).not.toHaveClass('mdc-switch--checked');
                });
                it('the property is falsy', async () => {
                    const propValue = await limelSwitch.getProperty('value');
                    expect(propValue).toBeFalsy();
                });
            });
        });
    });

    describe('when the attribute `disabled`', () => {
        describe('is not set', () => {
            let limelSwitch;
            let mdcSwitch;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-switch label="Active"></limel-switch>
                `);
                limelSwitch = await page.find('limel-switch');
                mdcSwitch = await page.find('limel-switch>>>.mdc-switch');
            });
            it('is enabled', () => {
                expect(mdcSwitch).not.toHaveClass('mdc-switch--disabled');
            });
            it('the property is falsy', async () => {
                const propValue = await limelSwitch.getProperty('disabled');
                expect(propValue).toBeFalsy();
            });

            describe('when then set to `true`', () => {
                beforeEach(async () => {
                    limelSwitch.setProperty('disabled', true);
                    await page.waitForChanges();
                });
                it('is disabled', () => {
                    expect(mdcSwitch).toHaveClass('mdc-switch--disabled');
                });
                it('the property is `true`', async () => {
                    const propValue = await limelSwitch.getProperty('disabled');
                    expect(propValue).toEqual(true);
                });
            });
        });

        describe('is set to `false`', () => {
            let limelSwitch;
            let mdcSwitch;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-switch label="Active" disabled="false"></limel-switch>
                `);
                limelSwitch = await page.find('limel-switch');
                mdcSwitch = await page.find('limel-switch>>>.mdc-switch');
            });
            it('is enabled', () => {
                expect(mdcSwitch).not.toHaveClass('mdc-switch--disabled');
            });
            it('the property is falsy', async () => {
                const propValue = await limelSwitch.getProperty('disabled');
                expect(propValue).toBeFalsy();
            });

            describe('when then set to `true`', () => {
                beforeEach(async () => {
                    limelSwitch.setProperty('disabled', true);
                    await page.waitForChanges();
                });
                it('is disabled', () => {
                    expect(mdcSwitch).toHaveClass('mdc-switch--disabled');
                });
                it('the property is `true`', async () => {
                    const propValue = await limelSwitch.getProperty('disabled');
                    expect(propValue).toEqual(true);
                });
            });
        });

        describe('is set to `true`', () => {
            let limelSwitch;
            let mdcSwitch;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-switch label="Active" disabled="true"></limel-switch>
                `);
                limelSwitch = await page.find('limel-switch');
                mdcSwitch = await page.find('limel-switch>>>.mdc-switch');
            });
            it('is disabled', () => {
                expect(mdcSwitch).toHaveClass('mdc-switch--disabled');
            });
            it('the property is `true`', async () => {
                const propValue = await limelSwitch.getProperty('disabled');
                expect(propValue).toEqual(true);
            });

            describe('when then set to `false`', () => {
                beforeEach(async () => {
                    limelSwitch.setProperty('disabled', false);
                    await page.waitForChanges();
                });
                it('is enabled', () => {
                    expect(mdcSwitch).not.toHaveClass('mdc-switch--disabled');
                });
                it('the property is falsy', async () => {
                    const propValue = await limelSwitch.getProperty('disabled');
                    expect(propValue).toBeFalsy();
                });
            });
        });
    });
});

async function createPage(content) {
    return newE2EPage({ html: content });
}
