import { Option } from '@limetech/lime-elements';
import { newE2EPage } from '@stencil/core/testing';

describe('limel-select (native)', () => {
    let page;
    describe('with a label', () => {
        let limelSelect;
        let label;
        beforeEach(async () => {
            page = await createPage(`
                <limel-select data-native label="Favourite Doctor"></limel-select>
            `);
            limelSelect = await page.find('limel-select');
            label = await page.find('limel-select>>>.mdc-floating-label');
        });
        it('displays the correct label', () => {
            expect(label).toEqualText('Favourite Doctor');
        });

        describe('when changing the label', () => {
            beforeEach(async () => {
                limelSelect.setProperty('label', 'new label');
                await page.waitForChanges();
            });
            it('displays the new label', async () => {
                expect(label).toEqualText('new label');
            });
        });
    });

    describe('when the attribute `disabled`', () => {
        describe('is not set', () => {
            let limelSelect;
            let container;
            let innerSelect;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-select data-native label="Favourite Doctor"></limel-select>
                `);
                limelSelect = await page.find('limel-select');
                container = await page.find('limel-select>>>.limel-select');
                innerSelect = await page.find('limel-select>>>select');
            });
            it('is enabled', () => {
                expect(container).not.toHaveClass('mdc-select--disabled');
                expect(innerSelect).not.toHaveAttribute('disabled');
            });
            it('the property is falsy', async () => {
                const propValue = await limelSelect.getProperty('disabled');
                expect(propValue).toBeFalsy();
            });

            describe('when then set to `true`', () => {
                beforeEach(async () => {
                    await limelSelect.setProperty('disabled', true);
                    await page.waitForChanges();
                });
                it('is disabled', () => {
                    expect(container).toHaveClass('mdc-select--disabled');
                    expect(innerSelect).toHaveAttribute('disabled');
                });
                it('the property is `true`', async () => {
                    const propValue = await limelSelect.getProperty('disabled');
                    expect(propValue).toEqual(true);
                });
            });
        });

        describe('is set to `false`', () => {
            let limelSelect;
            let container;
            let innerSelect;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-select data-native label="Favourite Doctor" disabled="false"></limel-select>
                `);
                limelSelect = await page.find('limel-select');
                container = await page.find('limel-select>>>.limel-select');
                innerSelect = await page.find('limel-select>>>select');
            });
            it('is enabled', () => {
                expect(container).not.toHaveClass('mdc-select--disabled');
                expect(innerSelect).not.toHaveAttribute('disabled');
            });
            it('the property is falsy', async () => {
                const propValue = await limelSelect.getProperty('disabled');
                expect(propValue).toBeFalsy();
            });

            describe('when then set to `true`', () => {
                beforeEach(async () => {
                    await limelSelect.setProperty('disabled', true);
                    await page.waitForChanges();
                });
                it('is disabled', () => {
                    expect(container).toHaveClass('mdc-select--disabled');
                    expect(innerSelect).toHaveAttribute('disabled');
                });
                it('the property is `true`', async () => {
                    const propValue = await limelSelect.getProperty('disabled');
                    expect(propValue).toEqual(true);
                });
            });
        });

        describe('is set to `true`', () => {
            let limelSelect;
            let container;
            let innerSelect;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-select data-native label="Favourite Doctor" disabled="true"></limel-select>
                `);
                limelSelect = await page.find('limel-select');
                container = await page.find('limel-select>>>.limel-select');
                innerSelect = await page.find('limel-select>>>select');
            });
            it('is disabled', () => {
                expect(container).toHaveClass('mdc-select--disabled');
                expect(innerSelect).toHaveAttribute('disabled');
            });
            it('the property is `true`', async () => {
                const propValue = await limelSelect.getProperty('disabled');
                expect(propValue).toEqual(true);
            });

            describe('when then set to `false`', () => {
                beforeEach(async () => {
                    await limelSelect.setProperty('disabled', false);
                    await page.waitForChanges();
                });
                it('is enabled', () => {
                    expect(container).not.toHaveClass('mdc-select--disabled');
                    expect(innerSelect).not.toHaveAttribute('disabled');
                });
                it('the property is falsy', async () => {
                    const propValue = await limelSelect.getProperty('disabled');
                    expect(propValue).toBeFalsy();
                });
            });
        });
    });

    describe('when multiple is set', () => {
        let limelSelect;
        let innerSelect;
        const options: Option[] = [
            {
                text: 'Apple',
                value: 'apple',
            },
            {
                text: 'Lime',
                value: 'lime',
            },
            {
                text: 'Banana',
                value: 'banana',
            },
        ];

        beforeEach(async () => {
            page = await createPage(`
                <limel-select data-native multiple label="Favourite Fruit"></limel-select>
            `);
            limelSelect = await page.find('limel-select');
            innerSelect = await page.find('limel-select>>>select');

            await limelSelect.setProperty('options', options);
            await page.waitForChanges();
        });

        describe('when selecting a value', () => {
            let spy;

            beforeEach(async () => {
                spy = await page.spyOnEvent('change');
                const appleOption = await innerSelect.find(
                    'option[value="apple"]',
                );
                await appleOption.click();
            });

            it('emits change event', () => {
                expect(spy).toHaveReceivedEvent();
            });

            it('passes the selected option as the event details', () => {
                expect(spy).toHaveReceivedEventDetail([options[0]]);
            });

            describe('when selecting another value', () => {
                beforeEach(async () => {
                    spy = await page.spyOnEvent('change');
                    const appleOption = await innerSelect.find(
                        'option[value="lime"]',
                    );
                    await page.keyboard.down('Shift');
                    await appleOption.click();
                });

                it('emits one change event', () => {
                    expect(spy).toHaveReceivedEventTimes(1);
                });

                it('passes the selected option as the event details', () => {
                    expect(spy).toHaveReceivedEventDetail([
                        options[0],
                        options[1],
                    ]);
                });
            });
        });
    });
});

describe('limel-select (menu)', () => {
    let page;
    describe('with a label', () => {
        let limelSelect;
        let label;
        beforeEach(async () => {
            page = await createPage(`
                <limel-select label="Favourite Doctor"></limel-select>
            `);
            limelSelect = await page.find('limel-select');
            label = await page.find('limel-select>>>.mdc-floating-label');
        });
        it('displays the correct label', () => {
            expect(label).toEqualText('Favourite Doctor');
        });

        describe('when changing the label', () => {
            beforeEach(async () => {
                limelSelect.setProperty('label', 'new label');
                await page.waitForChanges();
            });
            it('displays the new label', async () => {
                expect(label).toEqualText('new label');
            });
        });
    });

    describe('when the attribute `disabled`', () => {
        describe('is not set', () => {
            let limelSelect;
            let mdcSelect;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-select label="Favourite Doctor"></limel-select>
                `);
                limelSelect = await page.find('limel-select');
                mdcSelect = await page.find('limel-select>>>.limel-select');
            });
            it('is enabled', () => {
                expect(mdcSelect).not.toHaveClass('mdc-select--disabled');
            });
            it('the property is falsy', async () => {
                const propValue = await limelSelect.getProperty('disabled');
                expect(propValue).toBeFalsy();
            });

            describe('when then set to `true`', () => {
                beforeEach(async () => {
                    await limelSelect.setProperty('disabled', true);
                    await page.waitForChanges();
                });
                it('is disabled', () => {
                    expect(mdcSelect).toHaveClass('mdc-select--disabled');
                });
                it('the property is `true`', async () => {
                    const propValue = await limelSelect.getProperty('disabled');
                    expect(propValue).toEqual(true);
                });
            });
        });

        describe('is set to `false`', () => {
            let limelSelect;
            let mdcSelect;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-select label="Favourite Doctor" disabled="false"></limel-select>
                `);
                limelSelect = await page.find('limel-select');
                mdcSelect = await page.find('limel-select>>>.limel-select');
            });
            it('is enabled', () => {
                expect(mdcSelect).not.toHaveClass('mdc-select--disabled');
            });
            it('the property is falsy', async () => {
                const propValue = await limelSelect.getProperty('disabled');
                expect(propValue).toBeFalsy();
            });

            describe('when then set to `true`', () => {
                beforeEach(async () => {
                    await limelSelect.setProperty('disabled', true);
                    await page.waitForChanges();
                });
                it('is disabled', () => {
                    expect(mdcSelect).toHaveClass('mdc-select--disabled');
                });
                it('the property is `true`', async () => {
                    const propValue = await limelSelect.getProperty('disabled');
                    expect(propValue).toEqual(true);
                });
            });
        });

        describe('is set to `true`', () => {
            let limelSelect;
            let mdcSelect;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-select label="Favourite Doctor" disabled="true"></limel-select>
                `);
                limelSelect = await page.find('limel-select');
                mdcSelect = await page.find('limel-select>>>.limel-select');
            });
            it('is disabled', () => {
                expect(mdcSelect).toHaveClass('mdc-select--disabled');
            });
            it('the property is `true`', async () => {
                const propValue = await limelSelect.getProperty('disabled');
                expect(propValue).toEqual(true);
            });

            describe('when then set to `false`', () => {
                beforeEach(async () => {
                    await limelSelect.setProperty('disabled', false);
                    await page.waitForChanges();
                });
                it('is enabled', () => {
                    expect(mdcSelect).not.toHaveClass('mdc-select--disabled');
                });
                it('the property is falsy', async () => {
                    const propValue = await limelSelect.getProperty('disabled');
                    expect(propValue).toBeFalsy();
                });
            });
        });
    });
});

async function createPage(content) {
    return newE2EPage({ html: content });
}
