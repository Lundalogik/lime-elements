import { render, h } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';
import {
    getAccessibleNames,
    getAccessibleNodes,
    getAccessibleProperties,
    getInvalidStates,
} from '../../util/test/accessibility-tree';

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

            if (type.name === 'textarea') {
                return;
            }

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
                expect(leadingIcon.getAttribute('name')).toEqual('unit-test');
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
                expect(trailingIcon.getAttribute('name')).toEqual('unit-test');
            });
        });
    }
});

describe('limel-input-field accessible name', () => {
    it('is the label of a text field', async () => {
        const { waitForChanges } = await render(
            <limel-input-field label="Full name" />
        );
        await waitForChanges();

        expect(await getAccessibleNames('textbox')).toEqual(['Full name']);
    });

    it('is the label of a textarea', async () => {
        const { waitForChanges } = await render(
            <limel-input-field type="textarea" label="Notes" />
        );
        await waitForChanges();

        expect(await getAccessibleNames('textbox')).toEqual(['Notes']);
    });

    it('is the label of a search field', async () => {
        const { waitForChanges } = await render(
            <limel-input-field type="search" label="Find a person" />
        );
        await waitForChanges();

        expect(await getAccessibleNames('searchbox')).toEqual([
            'Find a person',
        ]);
    });

    it('is the label, not the value and suffix of a number field', async () => {
        const { waitForChanges } = await render(
            <limel-input-field
                type="number"
                label="Weight"
                suffix="kg"
                value="70"
            />
        );
        await waitForChanges();

        expect(await getAccessibleNames('spinbutton')).toEqual(['Weight']);
    });

    it('is the label, not the prefix, of a text field', async () => {
        const { waitForChanges } = await render(
            <limel-input-field label="Price" prefix="$" value="12" />
        );
        await waitForChanges();

        expect(await getAccessibleNames('textbox')).toEqual(['Price']);
    });

    it('is the label, and not the placeholder, when there are both', async () => {
        const { waitForChanges } = await render(
            <limel-input-field label="Full name" placeholder="Jane Doe" />
        );
        await waitForChanges();

        expect(await getAccessibleNames('textbox')).toEqual(['Full name']);
    });

    it('is the placeholder when there is no label', async () => {
        const { waitForChanges } = await render(
            <limel-input-field placeholder="Search" leadingIcon="search" />
        );
        await waitForChanges();

        expect(await getAccessibleNames('textbox')).toEqual(['Search']);
    });

    it('is the label of the field inside a date picker', async () => {
        const { waitForChanges } = await render(
            <limel-date-picker label="Birthday" />
        );
        await waitForChanges();

        expect(await getAccessibleNames('textbox')).toEqual(['Birthday']);
    });
});

describe('limel-input-field accessible description', () => {
    it('is the helper text', async () => {
        const { waitForChanges } = await render(
            <limel-input-field
                label="Full name"
                helperText="As on your passport"
            />
        );
        await waitForChanges();

        expect(await getAccessibleNodes('textbox')).toEqual([
            { name: 'Full name', description: 'As on your passport' },
        ]);
    });

    it('is empty when there is no helper text', async () => {
        const { waitForChanges } = await render(
            <limel-input-field label="Full name" />
        );
        await waitForChanges();

        expect(await getAccessibleNodes('textbox')).toEqual([
            { name: 'Full name', description: '' },
        ]);
    });

    it('is the validation message when the value is not valid', async () => {
        const { root, waitForChanges } = await render(
            <limel-input-field label="Email" type="email" value="not-valid" />
        );
        await waitForChanges();

        const input = root.shadowRoot.querySelector('input');
        input.dispatchEvent(new Event('blur'));
        await waitForChanges();

        expect(input.validationMessage).not.toBe('');
        expect(await getAccessibleNodes('textbox')).toEqual([
            { name: 'Email', description: input.validationMessage },
        ]);
    });
});

describe('limel-input-field aria-controls', () => {
    it('does not point at the helper text', async () => {
        const { root, waitForChanges } = await render(
            <limel-input-field
                label="Full name"
                helperText="As on your passport"
            />
        );
        await waitForChanges();

        const input = root.shadowRoot.querySelector('input');
        expect(input.hasAttribute('aria-controls')).toBe(false);
    });

    it('points at the list of completions', async () => {
        const { root, waitForChanges } = await render(
            <limel-input-field
                label="Fruit"
                helperText="Pick one"
                completions={['Apple', 'Banana']}
            />
        );
        await waitForChanges();

        const input = root.shadowRoot.querySelector('input');
        const portal = root.shadowRoot.querySelector('limel-portal');
        expect(input.getAttribute('aria-controls')).toBe(portal.containerId);
    });
});

describe('limel-input-field invalid state', () => {
    it('is not announced as invalid by default', async () => {
        const { waitForChanges } = await render(
            <limel-input-field label="Full name" />
        );
        await waitForChanges();

        expect(await getInvalidStates('textbox')).toEqual([false]);
    });

    it('is announced when the invalid property is set', async () => {
        const { waitForChanges } = await render(
            <limel-input-field label="Full name" invalid />
        );
        await waitForChanges();

        expect(await getInvalidStates('textbox')).toEqual([true]);
    });

    it('is announced when the value does not pass validation', async () => {
        const { root, waitForChanges } = await render(
            <limel-input-field label="Email" type="email" value="not-valid" />
        );
        await waitForChanges();

        const input = root.shadowRoot.querySelector('input');
        input.dispatchEvent(new Event('blur'));
        await waitForChanges();

        expect(input.getAttribute('aria-invalid')).toBe('true');
        expect(await getInvalidStates('textbox')).toEqual([true]);
    });
});

describe('limel-input-field readonly state', () => {
    const getControl = (root: HTMLElement) =>
        root.shadowRoot.querySelector<HTMLInputElement | HTMLTextAreaElement>(
            'input, textarea'
        );

    it.each(['text', 'textarea'])(
        'of the %s field is announced as read only, and not as disabled',
        async (type) => {
            const { waitForChanges } = await render(
                <limel-input-field
                    label="Notes"
                    type={type}
                    value="Hello"
                    readonly={true}
                />
            );
            await waitForChanges();

            expect(await getAccessibleProperties('textbox')).toEqual([
                expect.objectContaining({ readonly: true, disabled: false }),
            ]);
        }
    );

    it.each(['text', 'textarea', 'number'])(
        'of the %s field can be reached with the keyboard',
        async (type) => {
            const { root, waitForChanges } = await render(
                <limel-input-field
                    label="Notes"
                    type={type}
                    value="12"
                    readonly={true}
                />
            );
            await waitForChanges();

            await userEvent.tab();

            expect(root.shadowRoot.activeElement).toBe(getControl(root));
        }
    );

    it('cannot be edited', async () => {
        const { root, waitForChanges, spyOnEvent } = await render(
            <limel-input-field label="Name" value="Ada" readonly={true} />
        );
        const changeSpy = spyOnEvent('change');
        await waitForChanges();

        getControl(root).focus();
        await userEvent.keyboard('abc');
        await waitForChanges();

        expect(getControl(root).value).toBe('Ada');
        expect(changeSpy).not.toHaveReceivedEvent();
    });

    it('does not offer completions when it has focus', async () => {
        const { root, waitForChanges } = await render(
            <limel-input-field
                label="Name"
                value="A"
                completions={['Ada', 'Alan']}
                readonly={true}
            />
        );
        await waitForChanges();

        getControl(root).focus();
        await waitForChanges();

        expect(root.shadowRoot.querySelector('limel-portal')).toBeNull();
    });

    it('offers completions when it is not read only', async () => {
        const { root, waitForChanges } = await render(
            <limel-input-field
                label="Name"
                value="A"
                completions={['Ada', 'Alan']}
            />
        );
        await waitForChanges();

        getControl(root).focus();
        await waitForChanges();

        expect(root.shadowRoot.querySelector('limel-portal')).not.toBeNull();
    });

    it('of a number field is read once, as a field with a name', async () => {
        const { root, waitForChanges } = await render(
            <limel-input-field
                label="Age"
                type="number"
                value="1234"
                formatNumber={true}
                readonly={true}
            />
        );
        await waitForChanges();

        expect(await getAccessibleNames('spinbutton')).toEqual(['Age']);
        expect(
            root.shadowRoot
                .querySelector('.lime-formatted-input')
                .getAttribute('aria-hidden')
        ).toBe('true');
    });

    it('shows the border of the field only while it has focus', async () => {
        const { root, waitForChanges } = await render(
            <limel-input-field label="Name" value="Ada" readonly={true} />
        );
        await waitForChanges();
        const outline = root.shadowRoot.querySelector('limel-notched-outline');
        const getBorderColor = () =>
            getComputedStyle(outline)
                .getPropertyValue('--limel-notched-outline-border-color')
                .trim();
        expect(getBorderColor()).toBe('transparent');

        getControl(root).focus();
        await waitForChanges();

        expect(getBorderColor()).not.toBe('transparent');
    });

    it('keeps showing the formatted number while a number field has focus', async () => {
        const { root, waitForChanges } = await render(
            <limel-input-field
                label="Age"
                type="number"
                value="1234"
                formatNumber={true}
                readonly={true}
            />
        );
        await waitForChanges();

        getControl(root).focus();
        await waitForChanges();

        expect(
            getComputedStyle(
                root.shadowRoot.querySelector('.lime-formatted-input')
            ).display
        ).toBe('block');
        expect(getComputedStyle(getControl(root)).color).toBe(
            'rgba(0, 0, 0, 0)'
        );
    });

    describe('with a trailing link', () => {
        const getLinkBackground = async (readonly: boolean) => {
            const { root, waitForChanges } = await render(
                <limel-input-field
                    label="Mail"
                    type="email"
                    value="ada@example.com"
                    showLink={true}
                    readonly={readonly}
                    style={{ '--contrast-100': '10, 20, 30' }}
                />
            );
            await waitForChanges();
            const link = root.shadowRoot.querySelector<HTMLElement>(
                'a.lime-trailing-icon-for-link'
            );
            link.style.transition = 'none';

            await userEvent.hover(root);

            return getComputedStyle(link).backgroundColor;
        };

        it('does not cover the value with a background when the pointer is over a read only field', async () => {
            expect(await getLinkBackground(true)).toBe('rgba(0, 0, 0, 0)');
        });

        it('gets a background when the pointer is over a field that is not read only', async () => {
            expect(await getLinkBackground(false)).not.toBe('rgba(0, 0, 0, 0)');
        });
    });

    it('stays disabled when it is both disabled and read only', async () => {
        const { root, waitForChanges } = await render(
            <limel-input-field
                label="Name"
                value="Ada"
                readonly={true}
                disabled={true}
            />
        );
        await waitForChanges();

        getControl(root).focus();

        expect(await getAccessibleProperties('textbox')).toEqual([
            expect.objectContaining({ disabled: true }),
        ]);
        expect(root.shadowRoot.activeElement).toBeNull();
    });

    it('is disabled, and not read only, when it is disabled', async () => {
        const { waitForChanges } = await render(
            <limel-input-field label="Name" value="Ada" disabled={true} />
        );
        await waitForChanges();

        expect(await getAccessibleProperties('textbox')).toEqual([
            expect.objectContaining({ readonly: false, disabled: true }),
        ]);
    });
});
