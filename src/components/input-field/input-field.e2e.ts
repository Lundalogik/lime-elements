import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { InputType } from './input-field.types';

describe('limel-input-field', () => {
    let page: E2EPage;
    let limelInput: E2EElement;
    let inputContainer: E2EElement;
    let label: E2EElement;
    let outline: E2EElement;

    const types: Array<{ name: InputType; [key: string]: any }> = [
        { name: 'email' },
        { name: 'number' },
        { name: 'password' },
        { name: 'search' },
        { name: 'tel' },
        { name: 'text' },
        { name: 'textarea', nativeSelector: 'limel-input-field>>>textarea' },
        { name: 'url' },
        { name: 'urlAsText', expectedNativeElementType: 'text' },
    ];

    types.forEach((type) =>
        describe(`with type="${type.name}"`, () => {
            beforeEach(async () => {
                page = await createPage(`
                    <limel-input-field
                        type="${type.name}"
                        label="Test"
                    ></limel-input-field>
                `);

                limelInput = await page.find('limel-input-field');
                inputContainer = await page.find(
                    'limel-input-field>>>label.mdc-text-field'
                );
            });
            if (type.name === 'textarea') {
                it('uses the `textarea` style', () => {
                    expect(inputContainer).toHaveClass(
                        'mdc-text-field--textarea'
                    );
                });
            } else {
                it('uses the `outlined` style', () => {
                    expect(inputContainer).toHaveClass(
                        'mdc-text-field--outlined'
                    );
                });
            }

            it('is NOT considered invalid', () => {
                expect(inputContainer).not.toHaveClass(
                    'mdc-text-field--invalid'
                );
            });
            it('is NOT disabled', () => {
                expect(inputContainer).not.toHaveClass(
                    'mdc-text-field--disabled'
                );
            });
            it('is NOT required', () => {
                expect(inputContainer).not.toHaveClass(
                    'mdc-text-field--required'
                );
            });
            it('does NOT have a leading icon', () => {
                expect(inputContainer).not.toHaveClass(
                    'mdc-text-field--with-leading-icon'
                );
            });
            it('does NOT have a trailing icon', () => {
                expect(inputContainer).not.toHaveClass(
                    'mdc-text-field--with-trailing-icon'
                );
            });
            describe('the native input', () => {
                let nativeInput: E2EElement;
                const typeName = type.expectedNativeElementType || type.name;

                beforeEach(async () => {
                    const selector =
                        type.nativeSelector || 'limel-input-field>>>input';
                    nativeInput = await page.find(selector);
                });
                if (typeName === 'textarea') {
                    it('uses a native textarea', () => {
                        expect(nativeInput).toBeTruthy();
                    });
                } else {
                    it(`has the type '${typeName}'`, () => {
                        expect(nativeInput).toEqualAttribute('type', typeName);
                    });
                }

                it('has the class `mdc-text-field__input`', () => {
                    expect(nativeInput).toHaveClass('mdc-text-field__input');
                });
            });
            describe('the label', () => {
                beforeEach(async () => {
                    label = await page.find(
                        'limel-input-field>>>.mdc-floating-label'
                    );
                });
                it('is NOT floating', () => {
                    expect(label).not.toHaveClass(
                        'mdc-floating-label--float-above'
                    );
                });
                describe('after focusing', () => {
                    beforeEach(async () => {
                        label.click();
                        await page.waitForEvent('click');
                        await page.waitForChanges();
                    });
                    it('IS floating', () => {
                        expect(label).toHaveClass(
                            'mdc-floating-label--float-above'
                        );
                    });
                });
            });
            describe('the outline', () => {
                beforeEach(async () => {
                    outline = await page.find(
                        'limel-input-field>>>.mdc-notched-outline'
                    );
                });
                it('has the expected structure', () => {
                    expect(replaceLabelId(outline.outerHTML)).toEqual(
                        '<span class="mdc-notched-outline mdc-notched-outline--upgraded" tabindex="-1"><span class="mdc-notched-outline__leading"></span><span class="mdc-notched-outline__notch"><span class="mdc-floating-label" id="tf-input-label">Test</span></span><span class="mdc-notched-outline__trailing"></span></span>'
                    );
                });
            });
            describe('when invalid is set to true', () => {
                beforeEach(async () => {
                    limelInput.setAttribute('invalid', true);
                    await page.waitForChanges();
                });
                it('IS invalid', () => {
                    expect(inputContainer).toHaveClass(
                        'mdc-text-field--invalid'
                    );
                });
                if (type.name !== 'textarea') {
                    it('has a trailing icon indicating the field is invalid', async () => {
                        const limelIcon = await page.find(
                            'limel-input-field>>>i.mdc-text-field__icon.mdc-text-field__icon--trailing>limel-icon'
                        );
                        expect(limelIcon).toBeTruthy();
                        expect(limelIcon).toEqualAttribute(
                            'name',
                            'high_importance'
                        );
                    });
                }
            });
            describe('when disabled is set to true', () => {
                beforeEach(async () => {
                    limelInput.setAttribute('disabled', true);
                    await page.waitForChanges();
                });
                it('IS disabled', () => {
                    expect(inputContainer).toHaveClass(
                        'mdc-text-field--disabled'
                    );
                });
            });
            describe('when required is set to true', () => {
                beforeEach(async () => {
                    limelInput.setAttribute('required', true);
                    await page.waitForChanges();
                });
                it('IS required', () => {
                    expect(inputContainer).toHaveClass(
                        'mdc-text-field--required'
                    );
                });
            });
            if (type.name !== 'textarea') {
                describe('when leadingIcon is set', () => {
                    beforeEach(async () => {
                        limelInput.setAttribute('leading-icon', 'unit-test');
                        await page.waitForChanges();
                    });
                    it('has the correct leading icon', async () => {
                        const leadingIcon = await page.find(
                            'limel-input-field>>>i.mdc-text-field__icon.mdc-text-field__icon--leading>limel-icon'
                        );
                        expect(leadingIcon).toBeTruthy();
                        expect(leadingIcon).toEqualAttribute(
                            'name',
                            'unit-test'
                        );
                    });
                });
                describe('when trailingIcon is set', () => {
                    beforeEach(async () => {
                        limelInput.setAttribute('trailing-icon', 'unit-test');
                        await page.waitForChanges();
                    });
                    it('has the correct trailing icon', async () => {
                        const trailingIcon = await page.find(
                            'limel-input-field>>>i.mdc-text-field__icon.mdc-text-field__icon--trailing>limel-icon'
                        );
                        expect(trailingIcon).toBeTruthy();
                        expect(trailingIcon).toEqualAttribute(
                            'name',
                            'unit-test'
                        );
                    });
                });
                describe('when leadingIcon and trailingIcon is set', () => {
                    beforeEach(async () => {
                        limelInput.setAttribute('leading-icon', 'angle_left');
                        limelInput.setAttribute('trailing-icon', 'angle_right');
                        await page.waitForChanges();
                    });
                    it('has the correct leading icon', async () => {
                        const leadingIcon = await page.find(
                            'limel-input-field>>>.mdc-text-field__icon.mdc-text-field__icon--leading>limel-icon'
                        );
                        expect(leadingIcon).toBeTruthy();
                        expect(leadingIcon).toEqualAttribute(
                            'name',
                            'angle_left'
                        );
                    });
                    it('has the correct trailing icon', async () => {
                        const trailingIcon = await page.find(
                            'limel-input-field>>>.mdc-text-field__icon.mdc-text-field__icon--trailing>limel-icon'
                        );
                        expect(trailingIcon).toBeTruthy();
                        expect(trailingIcon).toEqualAttribute(
                            'name',
                            'angle_right'
                        );
                    });
                });
            }
        })
    );

    describe('with type="urlAsText" and show-link=true', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-input-field
                    type="urlAsText"
                    label="Website"
                    show-link="true"
                ></limel-input-field>
            `);

            await page.evaluate(() => {
                const elements = document.querySelectorAll(
                    '.mdc-floating-label'
                );

                elements.forEach((el) => {
                    el.id = 'test';
                });
            });

            limelInput = await page.find('limel-input-field');
            inputContainer = await page.find(
                'limel-input-field>>>label.mdc-text-field'
            );
        });

        describe('with an empty value', () => {
            beforeEach(async () => {
                const nativeInput = await page.find(
                    'limel-input-field>>>input'
                );
                nativeInput.focus();
                limelInput.setProperty('value', '');
                nativeInput.press('Tab');
                await page.waitForChanges();
            });
            it('is NOT considered invalid', () => {
                expect(inputContainer).not.toHaveClass(
                    'mdc-text-field--invalid'
                );
            });
            it('has a trailing icon indicating that the link can be opened', async () => {
                const trailingIcon = await page.find(
                    'limel-input-field>>>.mdc-text-field__icon.lime-trailing-icon-for-link>limel-icon'
                );
                expect(trailingIcon).toBeTruthy();
                expect(trailingIcon).toEqualAttribute('name', 'external_link');
            });
        });

        const validUrls = [
            {
                input: 'https://www.fullyqualified.com/',
                expectedHref: 'https://www.fullyqualified.com/',
            },
            {
                input: 'http://www.fullyqualified.com/',
                expectedHref: 'http://www.fullyqualified.com/',
            },
            {
                input: '//www.relativeprotocol.com',
                expectedHref: '//www.relativeprotocol.com',
            },
            {
                input: 'www.missingprotocol.com',
                expectedHref: 'https://www.missingprotocol.com',
            },
            { input: 'nowww.com', expectedHref: 'https://nowww.com' },
            { input: '/aRelativeUrl', expectedHref: '/aRelativeUrl' },
            {
                input: 'nowww.com/with/email/address/in?queryString=someone@example.com',
                expectedHref:
                    'https://nowww.com/with/email/address/in?queryString=someone@example.com',
            },
        ];

        validUrls.forEach((url) =>
            describe(`with a value of '${url.input}'`, () => {
                beforeEach(async () => {
                    const nativeInput = await page.find(
                        'limel-input-field>>>input'
                    );
                    nativeInput.focus();
                    limelInput.setProperty('value', url.input);
                    nativeInput.press('Tab');
                    await page.waitForChanges();
                });
                it('is NOT considered invalid', () => {
                    expect(inputContainer).not.toHaveClass(
                        'mdc-text-field--invalid'
                    );
                });
                it(`has a link with the href '${url.expectedHref}'`, async () => {
                    const link = await page.find(
                        'limel-input-field>>>.mdc-text-field__icon.lime-trailing-icon-for-link'
                    );
                    expect(link).toEqualAttribute('href', url.expectedHref);
                });
                it('has a trailing icon indicating that the link can be opened', async () => {
                    const icon = await page.find(
                        'limel-input-field>>>.mdc-text-field__icon.lime-trailing-icon-for-link>limel-icon'
                    );
                    expect(icon).toEqualAttribute('name', 'external_link');
                });
            })
        );
    });
});

async function createPage(content: string) {
    return newE2EPage({ html: content });
}

function replaceLabelId(HTML: string) {
    return HTML.replace(
        /"a_(\d|[a-f]){8}-(\d|[a-f]){4}-(\d|[a-f]){4}-(\d|[a-f]){4}-(\d|[a-f]){12}"/g,
        '"tf-input-label"'
    );
}
