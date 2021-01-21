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
    ];

    types.forEach((type) =>
        describe(`with type="${type.name}"`, () => {
            const expectedInputId = 'tf-input-element';
            beforeEach(async () => {
                page = await createPage(`
                    <limel-input-field
                        type="${type.name}"
                        label="Test"
                    ></limel-input-field>
                `);
                limelInput = await page.find('limel-input-field');
                inputContainer = await page.find(
                    'limel-input-field>>>div.mdc-text-field'
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

                beforeEach(async () => {
                    const selector =
                        type.nativeSelector || 'limel-input-field>>>input';
                    nativeInput = await page.find(selector);
                });
                if (type.name === 'textarea') {
                    it('uses a native textarea', () => {
                        expect(nativeInput).toBeTruthy();
                    });
                } else {
                    it(`has the type '${type.name}'`, () => {
                        expect(nativeInput).toEqualAttribute('type', type.name);
                    });
                }

                it('has the expected `id`', () => {
                    expect(nativeInput).toEqualAttribute('id', expectedInputId);
                });
                it('has the class `mdc-text-field__input`', () => {
                    expect(nativeInput).toHaveClass('mdc-text-field__input');
                });
            });
            describe('the label', () => {
                beforeEach(async () => {
                    label = await page.find('limel-input-field>>>label');
                });
                it('is a "floating" label', () => {
                    expect(label).toHaveClass('mdc-floating-label');
                });
                it('is NOT floating', () => {
                    expect(label).not.toHaveClass(
                        'mdc-floating-label--float-above'
                    );
                });
                it('is linked to the native input', () => {
                    expect(label).toEqualAttribute('for', expectedInputId);
                });
                describe('after focusing', () => {
                    beforeEach(async () => {
                        label.focus();
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
                    expect(outline).toEqualHtml(`
                    <div class="mdc-notched-outline mdc-notched-outline--upgraded">
                        <div class="mdc-notched-outline__leading"></div>
                        <div class="mdc-notched-outline__notch">
                            <label for="tf-input-element" class="mdc-floating-label">
                                Test
                            </label>
                        </div>
                        <div class="mdc-notched-outline__trailing"></div>
                    </div>
                `);
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
                            'limel-input-field>>>i.mdc-text-field__icon.trailing-icon>limel-icon'
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
                        limelInput.setAttribute('leading-icon', 'cat');
                        await page.waitForChanges();
                    });
                    it('has the correct leading icon', async () => {
                        const leadingIcon = await page.find(
                            'limel-input-field>>>i.mdc-text-field__icon:not(.trailing-icon)>limel-icon'
                        );
                        expect(leadingIcon).toBeTruthy();
                        expect(leadingIcon).toEqualAttribute('name', 'cat');
                    });
                });
                describe('when trailingIcon is set', () => {
                    beforeEach(async () => {
                        limelInput.setAttribute('trailing-icon', 'dog');
                        await page.waitForChanges();
                    });
                    it('has the correct trailing icon', async () => {
                        const trailingIcon = await page.find(
                            'limel-input-field>>>i.mdc-text-field__icon.trailing-icon>limel-icon'
                        );
                        expect(trailingIcon).toBeTruthy();
                        expect(trailingIcon).toEqualAttribute('name', 'dog');
                    });
                });
                describe('when leadingIcon and trailingIcon is set', () => {
                    beforeEach(async () => {
                        limelInput.setAttribute('leading-icon', 'cat');
                        limelInput.setAttribute('trailing-icon', 'dog');
                        await page.waitForChanges();
                    });
                    it('has the correct leading icon', async () => {
                        const leadingIcon = await page.find(
                            'limel-input-field>>>.mdc-text-field__icon:not(.trailing-icon)>limel-icon'
                        );
                        expect(leadingIcon).toBeTruthy();
                        expect(leadingIcon).toEqualAttribute('name', 'cat');
                    });
                    it('has the correct trailing icon', async () => {
                        const trailingIcon = await page.find(
                            'limel-input-field>>>.mdc-text-field__icon.trailing-icon>limel-icon'
                        );
                        expect(trailingIcon).toBeTruthy();
                        expect(trailingIcon).toEqualAttribute('name', 'dog');
                    });
                });
            }
        })
    );
});

async function createPage(content: string) {
    return newE2EPage({ html: content });
}
