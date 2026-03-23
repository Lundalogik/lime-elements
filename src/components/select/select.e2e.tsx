import { render, h } from '@stencil/vitest';
import { Option } from './option.types';

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
});
