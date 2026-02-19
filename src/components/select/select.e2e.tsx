import { render, h } from '@stencil/vitest';

describe('limel-select (native)', () => {
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

            setProps({ label: 'new label' });
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

            setProps({ disabled: true });
            await waitForChanges();

            const container = root.shadowRoot.querySelector('.limel-select');
            expect(container.classList.contains('mdc-select--disabled')).toBe(
                true
            );
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

            setProps({ disabled: false });
            await waitForChanges();

            const container = root.shadowRoot.querySelector('.limel-select');
            expect(container.classList.contains('mdc-select--disabled')).toBe(
                false
            );
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

            setProps({ disabled: true });
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

            setProps({ disabled: false });
            await waitForChanges();

            const mdcSelect = root.shadowRoot.querySelector('.limel-select');
            expect(mdcSelect.classList.contains('mdc-select--disabled')).toBe(
                false
            );
        });
    });
});
