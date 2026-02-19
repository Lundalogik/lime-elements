import { render, h } from '@stencil/vitest';

describe('limel-input-field', () => {
    const types = [
        { name: 'email' },
        { name: 'number' },
        { name: 'password' },
        { name: 'search' },
        { name: 'tel' },
        { name: 'text' },
        { name: 'textarea', nativeSelector: 'textarea' },
        { name: 'url' },
        { name: 'urlAsText', expectedNativeElementType: 'text' },
    ];

    for (const type of types) {
        describe(`with type="${type.name}"`, () => {
            it('renders the correct style', async () => {
                const { root, waitForChanges } = await render(
                    <limel-input-field
                        type={type.name}
                        label="Test"
                    ></limel-input-field>
                );
                await waitForChanges();

                const inputContainer = root.shadowRoot!.querySelector(
                    'label.mdc-text-field'
                );
                if (type.name === 'textarea') {
                    expect(
                        inputContainer.classList.contains(
                            'mdc-text-field--textarea'
                        )
                    ).toBe(true);
                } else {
                    expect(
                        inputContainer.classList.contains(
                            'mdc-text-field--outlined'
                        )
                    ).toBe(true);
                }
            });

            it('is NOT considered invalid', async () => {
                const { root, waitForChanges } = await render(
                    <limel-input-field
                        type={type.name}
                        label="Test"
                    ></limel-input-field>
                );
                await waitForChanges();

                const inputContainer = root.shadowRoot!.querySelector(
                    'label.mdc-text-field'
                );
                expect(
                    inputContainer.classList.contains('mdc-text-field--invalid')
                ).toBe(false);
            });

            it('is NOT disabled', async () => {
                const { root, waitForChanges } = await render(
                    <limel-input-field
                        type={type.name}
                        label="Test"
                    ></limel-input-field>
                );
                await waitForChanges();

                const inputContainer = root.shadowRoot!.querySelector(
                    'label.mdc-text-field'
                );
                expect(
                    inputContainer.classList.contains(
                        'mdc-text-field--disabled'
                    )
                ).toBe(false);
            });

            it('is NOT required', async () => {
                const { root, waitForChanges } = await render(
                    <limel-input-field
                        type={type.name}
                        label="Test"
                    ></limel-input-field>
                );
                await waitForChanges();

                const inputContainer = root.shadowRoot!.querySelector(
                    'label.mdc-text-field'
                );
                expect(
                    inputContainer.classList.contains(
                        'mdc-text-field--required'
                    )
                ).toBe(false);
            });

            it('has the correct native input', async () => {
                const { root, waitForChanges } = await render(
                    <limel-input-field
                        type={type.name}
                        label="Test"
                    ></limel-input-field>
                );
                await waitForChanges();

                const selector = type.nativeSelector || 'input';
                const nativeInput = root.shadowRoot!.querySelector(selector);
                const typeName = type.expectedNativeElementType || type.name;

                if (typeName === 'textarea') {
                    expect(nativeInput).toBeTruthy();
                } else {
                    expect(nativeInput.getAttribute('type')).toEqual(typeName);
                }

                expect(
                    nativeInput.classList.contains('mdc-text-field__input')
                ).toBe(true);
            });

            it('IS invalid when invalid is set to true', async () => {
                const { root, waitForChanges } = await render(
                    <limel-input-field
                        type={type.name}
                        label="Test"
                        invalid={true}
                    ></limel-input-field>
                );
                await waitForChanges();

                const inputContainer = root.shadowRoot!.querySelector(
                    'label.mdc-text-field'
                );
                expect(
                    inputContainer.classList.contains('mdc-text-field--invalid')
                ).toBe(true);
            });

            it('IS disabled when disabled is set to true', async () => {
                const { root, waitForChanges } = await render(
                    <limel-input-field
                        type={type.name}
                        label="Test"
                        disabled={true}
                    ></limel-input-field>
                );
                await waitForChanges();

                const inputContainer = root.shadowRoot!.querySelector(
                    'label.mdc-text-field'
                );
                expect(
                    inputContainer.classList.contains(
                        'mdc-text-field--disabled'
                    )
                ).toBe(true);
            });

            it('IS required when required is set to true', async () => {
                const { root, waitForChanges } = await render(
                    <limel-input-field
                        type={type.name}
                        label="Test"
                        required={true}
                    ></limel-input-field>
                );
                await waitForChanges();

                const inputContainer = root.shadowRoot!.querySelector(
                    'label.mdc-text-field'
                );
                expect(
                    inputContainer.classList.contains(
                        'mdc-text-field--required'
                    )
                ).toBe(true);
            });

            if (type.name !== 'textarea') {
                it('has the correct leading icon when set', async () => {
                    const { root, waitForChanges } = await render(
                        <limel-input-field
                            type={type.name}
                            label="Test"
                            leadingIcon="unit-test"
                        ></limel-input-field>
                    );
                    await waitForChanges();

                    const leadingIcon = root.shadowRoot!.querySelector(
                        'i.mdc-text-field__icon.mdc-text-field__icon--leading>limel-icon'
                    );
                    expect(leadingIcon).toBeTruthy();
                    expect(leadingIcon.getAttribute('name')).toEqual(
                        'unit-test'
                    );
                });

                it('has the correct trailing icon when set', async () => {
                    const { root, waitForChanges } = await render(
                        <limel-input-field
                            type={type.name}
                            label="Test"
                            trailingIcon="unit-test"
                        ></limel-input-field>
                    );
                    await waitForChanges();

                    const trailingIcon = root.shadowRoot!.querySelector(
                        'i.mdc-text-field__icon.mdc-text-field__icon--trailing>limel-icon'
                    );
                    expect(trailingIcon).toBeTruthy();
                    expect(trailingIcon.getAttribute('name')).toEqual(
                        'unit-test'
                    );
                });
            }
        });
    }
});
