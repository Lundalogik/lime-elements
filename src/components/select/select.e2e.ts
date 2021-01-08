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

    describe('when the attribute `options`', () => {
        describe('is not set', () => {
            let testWrapper;
            let limelSelect;
            let innerSelect;
            let label;
            beforeEach(async () => {
                page = await createPage(`
                    <select-test-wrapper data-native></select-test-wrapper>
                `);
                testWrapper = await page.find('select-test-wrapper');
                limelSelect = await page.find('limel-select');
                innerSelect = await page.find('limel-select >>> select');
                label = await page.find('limel-select >>> .mdc-floating-label');
            });
            it.skip('has no options', async () => {
                const child = await innerSelect.find('option');
                expect(child).toBeFalsy();
            });
            it.skip('label is not floating', () => {
                expect(label).not.toHaveClass(
                    'mdc-floating-label--float-above'
                );
            });

            describe.skip('when then set to an empty array', () => {
                beforeEach(async () => {
                    await limelSelect.setProperty('options', []);
                    await page.waitForChanges();
                });
                it('has no options', async () => {
                    const child = await innerSelect.find('option');
                    expect(child).toBeFalsy();
                });
                it('label is not floating', () => {
                    expect(label).not.toHaveClass(
                        'mdc-floating-label--float-above'
                    );
                });
            });

            describe.skip('when then set to a populated array', () => {
                describe('with a value as the first option', () => {
                    testSettingOptions(
                        [
                            { text: 'David Tennant', value: '10' },
                            { text: 'Matt Smith', value: '11' },
                        ],
                        { text: 'David Tennant', value: '10' },
                        true
                    );

                    describe('and then changed to a different populated array', () => {
                        describe('with a value as the first option', () => {
                            testSettingOptions(
                                [
                                    { text: 'Peter Capaldi', value: '12' },
                                    { text: 'Jodie Witthaker', value: '13' },
                                ],
                                { text: 'Peter Capaldi', value: '12' },
                                true
                            );
                        });
                        describe('with an empty first option', () => {
                            testSettingOptions(
                                [
                                    { text: '', value: '' },
                                    { text: 'Matt Smith', value: '11' },
                                    { text: 'Peter Capaldi', value: '12' },
                                ],
                                null,
                                false
                            );
                        });
                        describe('with an empty and disabled first option', () => {
                            testSettingOptions(
                                [
                                    { text: '', value: '', disabled: true },
                                    { text: 'Jodie Witthaker', value: '13' },
                                ],
                                null,
                                false
                            );
                        });
                    });
                });
            });

            function testSettingOptions(
                options,
                expectedValue,
                expectFloating: boolean
            ) {
                beforeEach(async () => {
                    await testWrapper.setProperty('onChangeCalledTimes', 0);
                    await page.waitForChanges();
                    await limelSelect.setProperty('options', options);
                    await page.waitForChanges();
                });
                it('has options', async () => {
                    const child = await innerSelect.find('option');
                    expect(child).toBeTruthy();
                });
                it.skip(
                    'value is ' + JSON.stringify(expectedValue),
                    async () => {
                        const v = await testWrapper.getProperty('value');
                        expect(v).toEqual(expectedValue);
                    }
                );
                it.skip('onChange was called', async () => {
                    const c = await testWrapper.getProperty(
                        'onChangeCalledTimes'
                    );
                    expect(c).toEqual(1);
                });
                it.skip(
                    'onChange was called with value ' +
                        JSON.stringify(expectedValue),
                    async () => {
                        const d = await testWrapper.getProperty(
                            'onChangeLastEventDetails'
                        );
                        expect(d).toEqual(expectedValue);
                    }
                );
                let name = 'label is not floating';
                if (expectFloating) {
                    name = 'label is floating';
                }

                it.skip(name, () => {
                    if (expectFloating) {
                        expect(label).toHaveClass(
                            'mdc-floating-label--float-above'
                        );
                    } else {
                        expect(label).not.toHaveClass(
                            'mdc-floating-label--float-above'
                        );
                    }
                });
            }
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
                    'option[value="apple"]'
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
                        'option[value="lime"]'
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

    describe('when the attribute `options`', () => {
        describe('is not set', () => {
            let testWrapper;
            let limelSelect;
            let limelList;
            let label;
            beforeEach(async () => {
                page = await createPage(`
                    <select-test-wrapper></select-test-wrapper>
                `);
                testWrapper = await page.find('select-test-wrapper');
                limelSelect = await page.find('limel-select');
                limelList = await page.find('limel-select >>> limel-list');
                label = await page.find('limel-select >>> .mdc-floating-label');
            });
            it.skip('has no options', async () => {
                const child = await limelList.find('* >>> li');
                expect(child).toBeFalsy();
            });
            it.skip('label is not floating', () => {
                expect(label).not.toHaveClass(
                    'mdc-floating-label--float-above'
                );
            });

            describe.skip('when then set to an empty array', () => {
                beforeEach(async () => {
                    await limelSelect.setProperty('options', []);
                    await page.waitForChanges();
                });
                it('has no options', async () => {
                    const child = await limelList.find('* >>> li');
                    expect(child).toBeFalsy();
                });
                it('label is not floating', () => {
                    expect(label).not.toHaveClass(
                        'mdc-floating-label--float-above'
                    );
                });
            });

            describe.skip('when then set to a populated array', () => {
                describe('with a value as the first option', () => {
                    testSettingOptions([
                        { text: 'David Tennant', value: '10' },
                        { text: 'Matt Smith', value: '11' },
                    ]);

                    describe('and then changed to a different populated array', () => {
                        describe('with a value as the first option', () => {
                            testSettingOptions([
                                { text: 'Peter Capaldi', value: '12' },
                                { text: 'Jodie Witthaker', value: '13' },
                            ]);
                        });
                        describe('with an empty first option', () => {
                            testSettingOptions([
                                { text: '', value: '' },
                                { text: 'Matt Smith', value: '11' },
                                { text: 'Peter Capaldi', value: '12' },
                            ]);
                        });
                        describe('with an empty and disabled first option', () => {
                            testSettingOptions([
                                { text: '', value: '', disabled: true },
                                { text: 'Jodie Witthaker', value: '13' },
                            ]);
                        });
                    });
                });
            });

            function testSettingOptions(options) {
                beforeEach(async () => {
                    await testWrapper.setProperty('onChangeCalledTimes', 0);
                    await page.waitForChanges();
                    await limelSelect.setProperty('options', options);
                    await page.waitForChanges();
                });
                it('has options', async () => {
                    const child = await page.find(
                        'limel-select >>> limel-list >>> li'
                    );
                    expect(child).toBeTruthy();
                });
            }
        });
    });
});

async function createPage(content) {
    return newE2EPage({ html: content });
}
