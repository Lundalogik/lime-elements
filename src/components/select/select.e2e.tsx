import { render, h } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';
import { Option } from './option.types';
import {
    getAccessibleNames,
    getAccessibleNodes,
    getAccessibleProperties,
    getInvalidStates,
    getRequiredStates,
} from '../../util/test/accessibility-tree';

async function openSelect(root: any, waitForChanges: () => Promise<void>) {
    const nativeSelect = root.shadowRoot.querySelector('select');
    nativeSelect.dispatchEvent(new Event('focus'));
    await waitForChanges();
}

describe('limel-select (native)', () => {
    describe('auto-select behavior on open', () => {
        it('emits the first option when value does not match any option', async () => {
            const options: Option[] = [
                { text: 'Option A', value: 'a' },
                { text: 'Option B', value: 'b' },
                { text: 'Option C', value: 'c' },
            ];
            const staleValue: Option = {
                text: '',
                value: 'filtered-out-key',
            };

            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-select
                    data-native
                    label="Test"
                    options={options}
                    value={staleValue}
                ></limel-select>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            await openSelect(root, waitForChanges);

            expect(changeSpy).toHaveReceivedEventTimes(1);
            expect(changeSpy).toHaveReceivedEventDetail(options[0]);
        });

        it('emits the first option when value is null', async () => {
            const options: Option[] = [
                { text: 'Option A', value: 'a' },
                { text: 'Option B', value: 'b' },
            ];

            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-select
                    data-native
                    label="Test"
                    options={options}
                    value={null}
                ></limel-select>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            await openSelect(root, waitForChanges);

            expect(changeSpy).toHaveReceivedEventTimes(1);
            expect(changeSpy).toHaveReceivedEventDetail(options[0]);
        });

        it('emits the first option when value is undefined', async () => {
            const options: Option[] = [
                { text: 'Option A', value: 'a' },
                { text: 'Option B', value: 'b' },
            ];

            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-select
                    data-native
                    label="Test"
                    options={options}
                    value={undefined}
                ></limel-select>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            await openSelect(root, waitForChanges);

            expect(changeSpy).toHaveReceivedEventTimes(1);
            expect(changeSpy).toHaveReceivedEventDetail(options[0]);
        });

        it('does not emit when value matches an available option', async () => {
            const options: Option[] = [
                { text: 'Option A', value: 'a' },
                { text: 'Option B', value: 'b' },
            ];
            const validValue: Option = { text: 'Option A', value: 'a' };

            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-select
                    data-native
                    label="Test"
                    options={options}
                    value={validValue}
                ></limel-select>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            await openSelect(root, waitForChanges);

            expect(changeSpy).not.toHaveReceivedEvent();
        });

        it('does not emit when first option is a placeholder', async () => {
            const options: Option[] = [
                { text: 'Select one...', value: '' },
                { text: 'Option A', value: 'a' },
            ];
            const staleValue: Option = {
                text: '',
                value: 'filtered-out-key',
            };

            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-select
                    data-native
                    label="Test"
                    options={options}
                    value={staleValue}
                ></limel-select>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            await openSelect(root, waitForChanges);

            expect(changeSpy).not.toHaveReceivedEvent();
        });

        it('skips disabled options and emits the first enabled one', async () => {
            const options: Option[] = [
                { text: 'Option A', value: 'a', disabled: true },
                { text: 'Option B', value: 'b' },
            ];
            const staleValue: Option = {
                text: '',
                value: 'filtered-out-key',
            };

            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-select
                    data-native
                    label="Test"
                    options={options}
                    value={staleValue}
                ></limel-select>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            await openSelect(root, waitForChanges);

            expect(changeSpy).toHaveReceivedEventTimes(1);
            expect(changeSpy).toHaveReceivedEventDetail(options[1]);
        });

        it('does not emit when all options are disabled', async () => {
            const options: Option[] = [
                { text: 'Option A', value: 'a', disabled: true },
                { text: 'Option B', value: 'b', disabled: true },
            ];

            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-select
                    data-native
                    label="Test"
                    options={options}
                    value={null}
                ></limel-select>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            await openSelect(root, waitForChanges);

            expect(changeSpy).not.toHaveReceivedEvent();
        });

        it('does not emit when options array is empty', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-select
                    data-native
                    label="Test"
                    options={[]}
                    value={null}
                ></limel-select>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            await openSelect(root, waitForChanges);

            expect(changeSpy).not.toHaveReceivedEvent();
        });

        it('emits only once across multiple opens', async () => {
            const options: Option[] = [
                { text: 'Option A', value: 'a' },
                { text: 'Option B', value: 'b' },
            ];

            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-select
                    data-native
                    label="Test"
                    options={options}
                    value={null}
                ></limel-select>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            await openSelect(root, waitForChanges);
            await openSelect(root, waitForChanges);

            expect(changeSpy).toHaveReceivedEventTimes(1);
        });
    });

    describe('with a label', () => {
        it('displays the correct label', async () => {
            const { root, waitForChanges } = await render(
                <limel-select
                    data-native
                    label="Favourite Doctor"
                ></limel-select>
            );
            await waitForChanges();

            const label = root.shadowRoot.querySelector(
                '.limel-notched-outline--notch label'
            );
            expect(label.textContent).toEqual('Favourite Doctor');
        });

        it('displays the new label when changed', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-select
                    data-native
                    label="Favourite Doctor"
                ></limel-select>
            );
            await waitForChanges();

            await setProps({ label: 'new label' });
            await waitForChanges();

            const label = root.shadowRoot.querySelector(
                '.limel-notched-outline--notch label'
            );
            expect(label.textContent).toEqual('new label');
        });
    });

    describe('when the attribute `disabled`', () => {
        it('is enabled when not set', async () => {
            const { root, waitForChanges } = await render(
                <limel-select
                    data-native
                    label="Favourite Doctor"
                ></limel-select>
            );
            await waitForChanges();

            const container = root.shadowRoot.querySelector('.limel-select');
            const innerSelect = root.shadowRoot.querySelector('select');
            expect(container.classList.contains('mdc-select--disabled')).toBe(
                false
            );
            expect(innerSelect.hasAttribute('disabled')).toBe(false);
        });

        it('is disabled when set', async () => {
            const { root, waitForChanges } = await render(
                <limel-select
                    data-native
                    label="Favourite Doctor"
                    disabled
                ></limel-select>
            );
            await waitForChanges();

            const container = root.shadowRoot.querySelector('.limel-select');
            const innerSelect = root.shadowRoot.querySelector('select');
            expect(container.classList.contains('mdc-select--disabled')).toBe(
                true
            );
            expect(innerSelect.hasAttribute('disabled')).toBe(true);
        });

        it('becomes disabled when property changes to true', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-select
                    data-native
                    label="Favourite Doctor"
                ></limel-select>
            );
            await waitForChanges();

            await setProps({ disabled: true });
            await waitForChanges();

            const container = root.shadowRoot.querySelector('.limel-select');
            const innerSelect = root.shadowRoot.querySelector('select');
            expect(container.classList.contains('mdc-select--disabled')).toBe(
                true
            );
            expect(innerSelect.hasAttribute('disabled')).toBe(true);
        });

        it('becomes enabled when property changes to false', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-select
                    data-native
                    label="Favourite Doctor"
                    disabled
                ></limel-select>
            );
            await waitForChanges();

            await setProps({ disabled: false });
            await waitForChanges();

            const container = root.shadowRoot.querySelector('.limel-select');
            const innerSelect = root.shadowRoot.querySelector('select');
            expect(container.classList.contains('mdc-select--disabled')).toBe(
                false
            );
            expect(innerSelect.hasAttribute('disabled')).toBe(false);
        });
    });
});

describe('limel-select (menu)', () => {
    describe('with a label', () => {
        it('displays the correct label', async () => {
            const { root, waitForChanges } = await render(
                <limel-select label="Favourite Doctor"></limel-select>
            );
            await waitForChanges();

            const label = root.shadowRoot.querySelector(
                '.limel-notched-outline--notch label'
            );
            expect(label.textContent).toEqual('Favourite Doctor');
        });

        it('displays the new label when changed', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-select label="Favourite Doctor"></limel-select>
            );
            await waitForChanges();

            await setProps({ label: 'new label' });
            await waitForChanges();

            const label = root.shadowRoot.querySelector(
                '.limel-notched-outline--notch label'
            );
            expect(label.textContent).toEqual('new label');
        });
    });

    describe('when the attribute `disabled`', () => {
        it('is enabled when not set', async () => {
            const { root, waitForChanges } = await render(
                <limel-select label="Favourite Doctor"></limel-select>
            );
            await waitForChanges();

            const mdcSelect = root.shadowRoot.querySelector('.limel-select');
            expect(mdcSelect.classList.contains('mdc-select--disabled')).toBe(
                false
            );
        });

        it('is disabled when set', async () => {
            const { root, waitForChanges } = await render(
                <limel-select label="Favourite Doctor" disabled></limel-select>
            );
            await waitForChanges();

            const mdcSelect = root.shadowRoot.querySelector('.limel-select');
            expect(mdcSelect.classList.contains('mdc-select--disabled')).toBe(
                true
            );
        });

        it('becomes disabled when property changes to true', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-select label="Favourite Doctor"></limel-select>
            );
            await waitForChanges();

            await setProps({ disabled: true });
            await waitForChanges();

            const mdcSelect = root.shadowRoot.querySelector('.limel-select');
            expect(mdcSelect.classList.contains('mdc-select--disabled')).toBe(
                true
            );
        });

        it('becomes enabled when property changes to false', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-select label="Favourite Doctor" disabled></limel-select>
            );
            await waitForChanges();

            await setProps({ disabled: false });
            await waitForChanges();

            const mdcSelect = root.shadowRoot.querySelector('.limel-select');
            expect(mdcSelect.classList.contains('mdc-select--disabled')).toBe(
                false
            );
        });
    });

    describe('with a primary component', () => {
        const optionsWithPrimary: Option[] = [
            {
                text: 'Option A',
                value: 'a',
                primaryComponent: {
                    name: 'limel-spinner',
                    props: { size: 'mini' },
                },
            },
            { text: 'Option B', value: 'b' },
        ];

        it('renders the primary component in the trigger for the selected option', async () => {
            const { root, waitForChanges } = await render(
                <limel-select
                    label="Test"
                    options={optionsWithPrimary}
                    value={optionsWithPrimary[0]}
                ></limel-select>
            );
            await waitForChanges();

            const primary = root.shadowRoot.querySelector(
                '.limel-select__selected-option__primary-component'
            );
            expect(primary).not.toBeNull();
            expect(primary.tagName.toLowerCase()).toBe('limel-spinner');
        });

        it('does not render a primary component when the selected option has none', async () => {
            const { root, waitForChanges } = await render(
                <limel-select
                    label="Test"
                    options={optionsWithPrimary}
                    value={optionsWithPrimary[1]}
                ></limel-select>
            );
            await waitForChanges();

            const wrapper = root.shadowRoot.querySelector(
                '.limel-select__selected-option__primary-component'
            );
            expect(wrapper).toBeNull();
        });
    });

    describe('choosing the dropdown on a mobile device', () => {
        const renderOnMobile = async (
            options: Option[]
        ): Promise<HTMLSelectElement | null> => {
            const { root, waitForChanges } = await render(
                <limel-select
                    data-native
                    label="Test"
                    options={options}
                ></limel-select>
            );
            await waitForChanges();

            return root.shadowRoot.querySelector('select');
        };

        it('uses the native dropdown when every option only has a text', async () => {
            const nativeSelect = await renderOnMobile([
                { text: 'Option A', value: 'a' },
                { text: 'Option B', value: 'b' },
            ]);

            expect(nativeSelect).not.toBeNull();
        });

        it('falls back to the menu dropdown when an option has a primary component', async () => {
            const nativeSelect = await renderOnMobile([
                {
                    text: 'Option A',
                    value: 'a',
                    primaryComponent: {
                        name: 'limel-spinner',
                        props: { size: 'mini' },
                    },
                },
                { text: 'Option B', value: 'b' },
            ]);

            expect(nativeSelect).toBeNull();
        });

        it('falls back to the menu dropdown when an option has a secondary text', async () => {
            const nativeSelect = await renderOnMobile([
                { text: 'Option A', value: 'a', secondaryText: 'Details' },
                { text: 'Option B', value: 'b' },
            ]);

            expect(nativeSelect).toBeNull();
        });

        it('falls back to the menu dropdown when an option has an icon name', async () => {
            const nativeSelect = await renderOnMobile([
                { text: 'Option A', value: 'a', icon: 'archive' },
                { text: 'Option B', value: 'b' },
            ]);

            expect(nativeSelect).toBeNull();
        });

        it('falls back to the menu dropdown when an option has an icon object', async () => {
            const nativeSelect = await renderOnMobile([
                {
                    text: 'Option A',
                    value: 'a',
                    icon: { name: 'archive', color: 'grey' },
                },
                { text: 'Option B', value: 'b' },
            ]);

            expect(nativeSelect).toBeNull();
        });
    });

    describe('helper text', () => {
        const options: Option[] = [{ text: 'Option A', value: 'a' }];

        // Read the custom property rather than the rendered height: the
        // helper line animates open over 0.46s, so a height assertion would
        // race the transition.
        const helperLineRows = (root: any) =>
            getComputedStyle(root.shadowRoot.querySelector('limel-helper-line'))
                .getPropertyValue('--limel-h-l-grid-template-rows')
                .trim();

        const renderSelect = async () =>
            render(
                <limel-select
                    label="Letter"
                    helperText="Pick a letter"
                    options={options}
                ></limel-select>
            );

        it('is collapsed while the dropdown is closed', async () => {
            const { root, waitForChanges } = await renderSelect();
            await waitForChanges();

            expect(helperLineRows(root)).toBe('0fr');
        });

        // The anchor decides where the dropdown is placed, and a miss falls
        // back to the host, which stretches to a taller flex sibling — the
        // regression fixed in #3858. Nothing else would fail on a rename.
        it('anchors the dropdown to the field rather than the host', async () => {
            const { root, waitForChanges } = await renderSelect();
            await waitForChanges();

            const portal = root.shadowRoot.querySelector('limel-portal');
            const field = root.shadowRoot.querySelector('.limel-select__field');

            expect(field).not.toBeNull();
            expect(portal.anchor).toBe(field);
        });

        it('is expanded while the dropdown is open', async () => {
            const { root, waitForChanges } = await renderSelect();
            await waitForChanges();

            root.shadowRoot.querySelector('.limel-select-trigger').click();
            await waitForChanges();

            expect(helperLineRows(root)).toBe('1fr');
        });
    });

    describe('typeahead', () => {
        const doctors: Option[] = [
            { text: 'Jodie Whittaker', value: '13' },
            { text: 'Peter Capaldi', value: '12' },
            { text: 'Matt Smith', value: '11' },
            { text: 'David Tennant', value: '10' },
        ];

        // An icon is enough to keep a mobile device on the custom dropdown,
        // which then has to do its own typeahead and focus handling.
        const doctorsWithIcons: Option[] = doctors.map((doctor) => ({
            ...doctor,
            icon: 'user',
        }));

        // `cancelable` matches what a browser dispatches, and is what makes
        // `preventDefault` observable through the returned event.
        const pressKey = (
            root: any,
            key: string,
            modifiers: KeyboardEventInit = {}
        ): KeyboardEvent => {
            const trigger = root.shadowRoot.querySelector(
                '.limel-select-trigger'
            );

            const event = new KeyboardEvent('keydown', {
                key: key,
                bubbles: true,
                cancelable: true,
                composed: true,
                ...modifiers,
            });
            trigger.dispatchEvent(event);

            return event;
        };

        const isOpen = (root: any) =>
            root.shadowRoot
                .querySelector('.limel-select-trigger')
                .getAttribute('aria-expanded') === 'true';

        // Note that there is no test for `disabled`. A disabled trigger never
        // receives key events in a browser, but a dispatched event still
        // reaches the listener, so such a test would only assert the test
        // setup rather than the component.

        it('opens the dropdown when a matching character is typed', async () => {
            const { root, waitForChanges } = await render(
                <limel-select label="Doctor" options={doctors}></limel-select>
            );
            await waitForChanges();

            pressKey(root, 'm');
            await waitForChanges();

            expect(isOpen(root)).toBe(true);
        });

        it('suppresses the default action of a consumed character', async () => {
            const { root, waitForChanges } = await render(
                <limel-select label="Doctor" options={doctors}></limel-select>
            );
            await waitForChanges();

            // Characters must not reach `MDCList`, which would treat them as
            // its own typeahead and swallow the next `Enter`.
            expect(pressKey(root, 'm').defaultPrevented).toBe(true);
        });

        it('leaves a key it does not consume alone', async () => {
            const { root, waitForChanges } = await render(
                <limel-select label="Doctor" options={doctors}></limel-select>
            );
            await waitForChanges();

            expect(pressKey(root, 'ArrowLeft').defaultPrevented).toBe(false);
        });

        it('does not change the value while typing', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-select label="Doctor" options={doctors}></limel-select>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            pressKey(root, 'm');
            await waitForChanges();
            pressKey(root, 'a');
            await waitForChanges();

            expect(changeSpy).not.toHaveReceivedEvent();
        });

        it('leaves the dropdown closed when nothing matches', async () => {
            const { root, waitForChanges } = await render(
                <limel-select label="Doctor" options={doctors}></limel-select>
            );
            await waitForChanges();

            pressKey(root, 'z');
            await waitForChanges();

            expect(isOpen(root)).toBe(false);
        });

        it('ignores characters typed with a modifier', async () => {
            const { root, waitForChanges } = await render(
                <limel-select label="Doctor" options={doctors}></limel-select>
            );
            await waitForChanges();

            pressKey(root, 'm', { ctrlKey: true });
            await waitForChanges();

            expect(isOpen(root)).toBe(false);
        });

        it('leaves typeahead to the native dropdown on mobile', async () => {
            const { root, waitForChanges } = await render(
                <limel-select
                    data-native
                    label="Doctor"
                    options={doctors}
                ></limel-select>
            );
            await waitForChanges();

            pressKey(root, 'm');
            await waitForChanges();

            expect(isOpen(root)).toBe(false);
        });

        it('handles typeahead on mobile when the dropdown is not native', async () => {
            const { root, waitForChanges } = await render(
                <limel-select
                    data-native
                    label="Doctor"
                    options={doctorsWithIcons}
                ></limel-select>
            );
            await waitForChanges();

            pressKey(root, 'm');
            await waitForChanges();

            expect(isOpen(root)).toBe(true);
        });

        it('highlights the matching option', async () => {
            const { root, waitForChanges } = await render(
                <limel-select label="Doctor" options={doctors}></limel-select>
            );
            await waitForChanges();

            pressKey(root, 'm');
            await waitForChanges();

            await vi.waitFor(() => {
                const list = document.querySelector(
                    'limel-menu-surface limel-list'
                );
                const focused = list?.shadowRoot?.activeElement as HTMLElement;

                expect(focused?.dataset.index).toBe('2');
            });
        });

        it('highlights the matching option on mobile too, when the dropdown is not native', async () => {
            const { root, waitForChanges } = await render(
                <limel-select
                    data-native
                    label="Doctor"
                    options={doctorsWithIcons}
                ></limel-select>
            );
            await waitForChanges();

            pressKey(root, 'm');
            await waitForChanges();

            await vi.waitFor(() => {
                const list = document.querySelector(
                    'limel-menu-surface limel-list'
                );
                const focused = list?.shadowRoot?.activeElement as HTMLElement;

                expect(focused?.dataset.index).toBe('2');
            });
        });

        describe('still opens the dropdown', () => {
            it('with Enter', async () => {
                const { root, waitForChanges } = await render(
                    <limel-select
                        label="Doctor"
                        options={doctors}
                    ></limel-select>
                );
                await waitForChanges();

                pressKey(root, 'Enter');
                await waitForChanges();

                expect(isOpen(root)).toBe(true);
            });

            it('with the space bar', async () => {
                const { root, waitForChanges } = await render(
                    <limel-select
                        label="Doctor"
                        options={doctors}
                    ></limel-select>
                );
                await waitForChanges();

                pressKey(root, ' ');
                await waitForChanges();

                expect(isOpen(root)).toBe(true);
            });
        });

        describe('opens the dropdown with an arrow key', () => {
            it.each(['ArrowDown', 'ArrowUp'])('%s', async (key) => {
                const { root, waitForChanges } = await render(
                    <limel-select
                        label="Doctor"
                        options={doctors}
                    ></limel-select>
                );
                await waitForChanges();

                pressKey(root, key);
                await waitForChanges();

                expect(isOpen(root)).toBe(true);
            });

            it('and also with Alt held', async () => {
                const { root, waitForChanges } = await render(
                    <limel-select
                        label="Doctor"
                        options={doctors}
                    ></limel-select>
                );
                await waitForChanges();

                pressKey(root, 'ArrowDown', { altKey: true });
                await waitForChanges();

                expect(isOpen(root)).toBe(true);
            });

            it('and keeps the page from scrolling', async () => {
                const { root, waitForChanges } = await render(
                    <limel-select
                        label="Doctor"
                        options={doctors}
                    ></limel-select>
                );
                await waitForChanges();

                expect(pressKey(root, 'ArrowDown').defaultPrevented).toBe(true);
            });

            it('and moves the focus into the dropdown', async () => {
                const { root, waitForChanges } = await render(
                    <limel-select
                        label="Doctor"
                        options={doctors}
                    ></limel-select>
                );
                await waitForChanges();

                pressKey(root, 'ArrowDown');
                await waitForChanges();

                await vi.waitFor(() => {
                    const list = document.querySelector(
                        'limel-menu-surface limel-list'
                    );
                    const focused = list?.shadowRoot
                        ?.activeElement as HTMLElement;

                    expect(focused?.dataset.index).toBe('0');
                });
            });

            it('but not when the dropdown is the native one on mobile', async () => {
                const { root, waitForChanges, spyOnEvent } = await render(
                    <limel-select
                        data-native
                        label="Doctor"
                        options={doctors}
                    ></limel-select>
                );
                const changeSpy = spyOnEvent('change');
                await waitForChanges();

                const event = pressKey(root, 'ArrowDown');
                await waitForChanges();

                expect(
                    root.shadowRoot
                        .querySelector('.limel-select-trigger')
                        .classList.contains('limel-select--focused')
                ).toBe(false);
                expect(event.defaultPrevented).toBe(false);
                expect(changeSpy).not.toHaveReceivedEvent();
            });

            it('when the dropdown on mobile is not the native one', async () => {
                const { root, waitForChanges } = await render(
                    <limel-select
                        data-native
                        label="Doctor"
                        options={doctorsWithIcons}
                    ></limel-select>
                );
                await waitForChanges();

                pressKey(root, 'ArrowDown');
                await waitForChanges();

                expect(isOpen(root)).toBe(true);
            });

            it('without changing the value', async () => {
                const { root, waitForChanges, spyOnEvent } = await render(
                    <limel-select
                        label="Doctor"
                        options={doctors}
                    ></limel-select>
                );
                const changeSpy = spyOnEvent('change');
                await waitForChanges();

                pressKey(root, 'ArrowDown');
                await waitForChanges();

                expect(changeSpy).not.toHaveReceivedEvent();
            });

            it.each([{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }])(
                'but not with %o held',
                async (modifiers) => {
                    const { root, waitForChanges } = await render(
                        <limel-select
                            label="Doctor"
                            options={doctors}
                        ></limel-select>
                    );
                    await waitForChanges();

                    const event = pressKey(root, 'ArrowDown', modifiers);
                    await waitForChanges();

                    expect(isOpen(root)).toBe(false);
                    expect(event.defaultPrevented).toBe(false);
                }
            );
        });
    });
});

describe('limel-select focus', () => {
    const options: Option[] = [
        { text: 'One', value: 'one' },
        { text: 'Two', value: 'two' },
    ];

    const renderSelect = (props: Record<string, unknown> = {}) =>
        render(
            <limel-select
                label="Country"
                options={options}
                style={{
                    '--lime-primary-color': 'rgb(1, 2, 3)',
                    '--shadow-depth-8-focused': '0 0 0 2px rgb(255, 0, 0)',
                    '--button-shadow-hovered': 'none',
                }}
                {...props}
            />
        );

    const getLeadingOutline = (root: HTMLElement) =>
        root.shadowRoot.querySelector<HTMLElement>(
            '.limel-notched-outline--leading-outline'
        );

    // The border color has a transition, which would be half way when read.
    const getBorderColor = (root: HTMLElement) => {
        getLeadingOutline(root).style.transition = 'none';

        return getComputedStyle(getLeadingOutline(root)).borderTopColor;
    };

    it('has no border around the field when the trigger has no focus', async () => {
        const { root, waitForChanges } = await renderSelect();
        await waitForChanges();

        expect(getBorderColor(root)).toBe('rgba(0, 0, 0, 0)');
    });

    it('shows the border of the notched outline in the accent color while the trigger has keyboard focus', async () => {
        const { root, waitForChanges } = await renderSelect();
        await waitForChanges();

        await userEvent.tab();
        await waitForChanges();

        expect(getBorderColor(root)).toBe('rgb(1, 2, 3)');
    });

    it('shows the border of the notched outline in the accent color while a read only trigger has keyboard focus', async () => {
        const { root, waitForChanges } = await renderSelect({
            readonly: true,
        });
        await waitForChanges();

        await userEvent.tab();
        await waitForChanges();

        expect(getBorderColor(root)).toBe('rgb(1, 2, 3)');
    });

    it.each([
        ['a select', {}],
        ['a read only select', { readonly: true }],
    ])(
        'does not draw a ring, or a browser outline, around the trigger of %s, which would run through the label',
        async (_name, props) => {
            const { root, waitForChanges } = await renderSelect(props);
            await waitForChanges();
            const trigger = root.shadowRoot.querySelector<HTMLElement>(
                '.limel-select-trigger'
            );
            trigger.style.transition = 'none';

            await userEvent.tab();
            await waitForChanges();

            expect(root.shadowRoot.activeElement).toBe(trigger);
            expect(getComputedStyle(trigger).boxShadow).toBe('none');
            expect(getComputedStyle(trigger).outlineStyle).toBe('none');
        }
    );

    it('keeps the border of an invalid select, whether or not it has focus', async () => {
        const { root, waitForChanges } = await renderSelect({
            invalid: true,
        });
        await waitForChanges();
        const borderWithoutFocus = getBorderColor(root);

        await userEvent.tab();
        await waitForChanges();

        expect(borderWithoutFocus).not.toBe('rgba(0, 0, 0, 0)');
        expect(getBorderColor(root)).not.toBe('rgba(0, 0, 0, 0)');
    });
});

describe('limel-select accessible name', () => {
    const options: Option[] = [
        { text: 'One', value: '1' },
        { text: 'Two', value: '2' },
    ];

    it('is the label and the selected option', async () => {
        const { waitForChanges } = await render(
            <limel-select
                label="Country"
                options={options}
                value={options[0]}
            />
        );
        await waitForChanges();

        expect(await getAccessibleNames('combobox')).toEqual(['Country One']);
    });

    it('is only the label when nothing is selected', async () => {
        const { waitForChanges } = await render(
            <limel-select label="Country" options={options} />
        );
        await waitForChanges();

        expect(await getAccessibleNames('combobox')).toEqual(['Country']);
    });

    it('is only the selected option when there is no label', async () => {
        const { waitForChanges } = await render(
            <limel-select options={options} value={options[1]} />
        );
        await waitForChanges();

        expect(await getAccessibleNames('combobox')).toEqual(['Two']);
    });

    it('of the native select is the label', async () => {
        const { waitForChanges } = await render(
            <limel-select
                data-native
                label="Country"
                options={options}
                value={options[0]}
            />
        );
        await waitForChanges();

        expect(await getAccessibleNames('combobox')).toEqual(['Country']);
    });
});

describe('limel-select accessible description', () => {
    const options: Option[] = [
        { text: 'One', value: 'one' },
        { text: 'Two', value: 'two' },
    ];

    it('of the trigger is the helper text', async () => {
        const { waitForChanges } = await render(
            <limel-select
                label="Country"
                helperText="Where you live"
                options={options}
                value={options[0]}
            />
        );
        await waitForChanges();

        expect(await getAccessibleNodes('combobox')).toEqual([
            { name: 'Country One', description: 'Where you live' },
        ]);
    });

    it('of the native select is the helper text', async () => {
        const { waitForChanges } = await render(
            <limel-select
                data-native
                label="Country"
                helperText="Where you live"
                options={options}
                value={options[0]}
            />
        );
        await waitForChanges();

        expect(await getAccessibleNodes('combobox')).toEqual([
            { name: 'Country', description: 'Where you live' },
        ]);
    });
});

describe('limel-select invalid state', () => {
    const options: Option[] = [
        { text: 'One', value: 'one' },
        { text: 'Two', value: 'two' },
    ];

    it('of the trigger is not invalid by default', async () => {
        const { waitForChanges } = await render(
            <limel-select
                label="Country"
                options={options}
                value={options[0]}
            />
        );
        await waitForChanges();

        expect(await getInvalidStates('combobox')).toEqual([false]);
    });

    it('of the trigger is invalid when the select is', async () => {
        const { waitForChanges } = await render(
            <limel-select
                label="Country"
                options={options}
                value={options[0]}
                invalid={true}
            />
        );
        await waitForChanges();

        expect(await getInvalidStates('combobox')).toEqual([true]);
    });

    it('of the trigger is invalid when it is required and has no value after it was opened and closed', async () => {
        const { root, waitForChanges } = await render(
            <limel-select label="Country" options={options} required={true} />
        );
        await waitForChanges();
        expect(await getInvalidStates('combobox')).toEqual([false]);

        root.shadowRoot
            .querySelector<HTMLElement>('.limel-select-trigger')
            .click();
        await waitForChanges();
        document
            .querySelector('limel-menu-surface')
            .dispatchEvent(new CustomEvent('dismiss'));
        await waitForChanges();

        expect(await getInvalidStates('combobox')).toEqual([true]);
    });

    it('of the trigger next to a native select is not set, because a button cannot be invalid', async () => {
        const { root, waitForChanges } = await render(
            <limel-select
                data-native
                label="Country"
                options={options}
                invalid={true}
            />
        );
        await waitForChanges();

        expect(
            root.shadowRoot
                .querySelector('.limel-select-trigger')
                .hasAttribute('aria-invalid')
        ).toBe(false);
    });

    it('of the native select is not invalid by default', async () => {
        const { waitForChanges } = await render(
            <limel-select
                data-native
                label="Country"
                options={options}
                value={options[0]}
            />
        );
        await waitForChanges();

        expect(await getInvalidStates('combobox')).toEqual([false]);
    });

    it('of the native select is invalid when the select is', async () => {
        const { waitForChanges } = await render(
            <limel-select
                data-native
                label="Country"
                options={options}
                value={options[0]}
                invalid={true}
            />
        );
        await waitForChanges();

        expect(await getInvalidStates('combobox')).toEqual([true]);
    });

    it('of the native select is invalid when it is required and has no value after it was opened and closed', async () => {
        const { root, waitForChanges } = await render(
            <limel-select
                data-native
                label="Country"
                options={options}
                required={true}
            />
        );
        await waitForChanges();
        expect(await getInvalidStates('combobox')).toEqual([false]);

        const nativeSelect = root.shadowRoot.querySelector('select');
        nativeSelect.dispatchEvent(new Event('focus'));
        await waitForChanges();
        nativeSelect.dispatchEvent(new Event('blur'));
        await waitForChanges();

        expect(await getInvalidStates('combobox')).toEqual([true]);
    });
});

describe('limel-select trigger', () => {
    const options: Option[] = [
        { text: 'One', value: 'one' },
        { text: 'Two', value: 'two' },
    ];

    const getTrigger = (root: HTMLElement) =>
        root.shadowRoot.querySelector('.limel-select-trigger');

    it('is a combobox, and not a button', async () => {
        const { waitForChanges } = await render(
            <limel-select label="Country" options={options} />
        );
        await waitForChanges();

        expect(await getAccessibleNames('combobox')).toEqual(['Country']);
        expect(await getAccessibleNames('button')).toEqual([]);
    });

    it('stays a button next to a native select', async () => {
        const { waitForChanges } = await render(
            <limel-select data-native label="Country" options={options} />
        );
        await waitForChanges();

        expect(await getAccessibleNames('button')).toEqual(['Country']);
        expect(await getAccessibleNames('combobox')).toEqual(['Country']);
    });

    it('says nothing about being expanded next to a native select', async () => {
        const { root, waitForChanges } = await render(
            <limel-select data-native label="Country" options={options} />
        );
        await waitForChanges();

        expect(getTrigger(root).hasAttribute('aria-expanded')).toBe(false);
    });

    it('says that it opens a listbox', async () => {
        const { root, waitForChanges } = await render(
            <limel-select label="Country" options={options} />
        );
        await waitForChanges();

        expect(getTrigger(root).getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('says that it is collapsed while the dropdown is closed', async () => {
        const { root, waitForChanges } = await render(
            <limel-select label="Country" options={options} />
        );
        await waitForChanges();

        expect(getTrigger(root).getAttribute('aria-expanded')).toBe('false');
    });

    it('says that it is expanded while the dropdown is open', async () => {
        const { root, waitForChanges } = await render(
            <limel-select label="Country" options={options} />
        );
        await waitForChanges();

        (getTrigger(root) as HTMLElement).click();
        await waitForChanges();

        expect(getTrigger(root).getAttribute('aria-expanded')).toBe('true');
    });
});

describe('limel-select required state', () => {
    const options: Option[] = [
        { text: 'One', value: 'one' },
        { text: 'Two', value: 'two' },
    ];

    it('of the trigger is not required by default', async () => {
        const { waitForChanges } = await render(
            <limel-select label="Country" options={options} />
        );
        await waitForChanges();

        expect(await getRequiredStates('combobox')).toEqual([false]);
    });

    it('of the trigger is required when the select is', async () => {
        const { waitForChanges } = await render(
            <limel-select label="Country" options={options} required={true} />
        );
        await waitForChanges();

        expect(await getRequiredStates('combobox')).toEqual([true]);
    });

    it('of the trigger is not required anymore when the select stops being', async () => {
        const { root, waitForChanges } = await render(
            <limel-select label="Country" options={options} required={true} />
        );
        await waitForChanges();
        expect(await getRequiredStates('combobox')).toEqual([true]);

        (root as HTMLLimelSelectElement).required = false;
        await waitForChanges();

        expect(await getRequiredStates('combobox')).toEqual([false]);
    });

    it('of the trigger next to a native select is not set, because a button cannot be required', async () => {
        const { root, waitForChanges } = await render(
            <limel-select
                data-native
                label="Country"
                options={options}
                required={true}
            />
        );
        await waitForChanges();

        expect(
            root.shadowRoot
                .querySelector('.limel-select-trigger')
                .hasAttribute('aria-required')
        ).toBe(false);
    });

    it('of the native select is the attribute, with no empty aria-required', async () => {
        const { root, waitForChanges } = await render(
            <limel-select
                data-native
                label="Country"
                options={options}
                required={true}
            />
        );
        await waitForChanges();
        const nativeSelect = root.shadowRoot.querySelector('select');

        expect(nativeSelect.required).toBe(true);
        expect(nativeSelect.hasAttribute('aria-required')).toBe(false);
    });
});

describe('limel-select readonly state', () => {
    const options: Option[] = [
        { text: 'One', value: 'one' },
        { text: 'Two', value: 'two' },
    ];

    const getTrigger = (root: HTMLElement) =>
        root.shadowRoot.querySelector<HTMLButtonElement>(
            '.limel-select-trigger'
        );

    const pressKey = (root: HTMLElement, key: string) => {
        const event = new KeyboardEvent('keydown', {
            key: key,
            bubbles: true,
            cancelable: true,
            composed: true,
        });
        getTrigger(root).dispatchEvent(event);

        return event;
    };

    const renderReadonlySelect = () =>
        render(
            <limel-select
                label="Country"
                options={options}
                value={options[0]}
                readonly={true}
            />
        );

    it('has a trigger that says it is read only, and is not disabled', async () => {
        const { root, waitForChanges } = await renderReadonlySelect();
        await waitForChanges();

        expect(getTrigger(root).getAttribute('aria-readonly')).toBe('true');
        expect(getTrigger(root).disabled).toBe(false);
        expect(await getAccessibleProperties('combobox')).toEqual([
            expect.objectContaining({ disabled: false }),
        ]);
    });

    it('has a trigger that is not read only by default', async () => {
        const { root, waitForChanges } = await render(
            <limel-select label="Country" options={options} />
        );
        await waitForChanges();

        expect(getTrigger(root).hasAttribute('aria-readonly')).toBe(false);
    });

    it('can be reached with the keyboard', async () => {
        const { root, waitForChanges } = await renderReadonlySelect();
        await waitForChanges();

        getTrigger(root).focus();

        expect(root.shadowRoot.activeElement).toBe(getTrigger(root));
    });

    it.each(['Enter', ' ', 'ArrowDown', 'ArrowUp', 'o'])(
        'does not open when %j is pressed',
        async (key) => {
            const { root, waitForChanges, spyOnEvent } =
                await renderReadonlySelect();
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            const event = pressKey(root, key);
            await waitForChanges();

            expect(getTrigger(root).getAttribute('aria-expanded')).toBe(
                'false'
            );
            expect(event.defaultPrevented).toBe(false);
            expect(changeSpy).not.toHaveReceivedEvent();
        }
    );

    it('does not open when it is clicked', async () => {
        const { root, waitForChanges } = await renderReadonlySelect();
        await waitForChanges();

        getTrigger(root).click();
        await waitForChanges();

        expect(getTrigger(root).getAttribute('aria-expanded')).toBe('false');
    });

    it('stays disabled when it is both disabled and read only', async () => {
        const { root, waitForChanges } = await render(
            <limel-select
                label="Country"
                options={options}
                readonly={true}
                disabled={true}
            />
        );
        await waitForChanges();

        expect(getTrigger(root).disabled).toBe(true);
    });

    it('stays disabled next to a native select, which has no read only state', async () => {
        const { root, waitForChanges } = await render(
            <limel-select
                data-native
                label="Country"
                options={options}
                readonly={true}
            />
        );
        await waitForChanges();

        expect(root.shadowRoot.querySelector('select').disabled).toBe(true);
        expect(getTrigger(root).disabled).toBe(true);
    });
});
