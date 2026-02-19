import { render, h } from '@stencil/vitest';

describe('limel-switch', () => {
    describe('with a label', () => {
        it('displays the correct label', async () => {
            const { root, waitForChanges } = await render(
                <limel-switch label="Active"></limel-switch>
            );
            await waitForChanges();

            const label = root.shadowRoot.querySelector('label');
            expect(label.textContent).toEqual('Active');
        });

        it('displays the new label when changed', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-switch label="Active"></limel-switch>
            );
            await waitForChanges();

            setProps({ label: 'new label' });
            await waitForChanges();

            const label = root.shadowRoot.querySelector('label');
            expect(label.textContent).toEqual('new label');
        });
    });

    describe('when the attribute `value`', () => {
        it('is "off" when not set', async () => {
            const { root, waitForChanges } = await render(
                <limel-switch label="Active"></limel-switch>
            );
            await waitForChanges();

            const mdcSwitch = root.shadowRoot.querySelector('.mdc-switch');
            expect(mdcSwitch.classList.contains('mdc-switch--selected')).toBe(
                false
            );
            expect((root as any).value).toBeFalsy();
        });

        it('is "on" when set to true', async () => {
            const { root, waitForChanges } = await render(
                <limel-switch label="Active" value={true}></limel-switch>
            );
            await waitForChanges();

            const mdcSwitch = root.shadowRoot.querySelector('.mdc-switch');
            expect(mdcSwitch.classList.contains('mdc-switch--selected')).toBe(
                true
            );
            expect((root as any).value).toEqual(true);
        });

        it('turns "on" when set to true via setProps', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-switch label="Active"></limel-switch>
            );
            await waitForChanges();

            setProps({ value: true });
            await waitForChanges();

            const mdcSwitch = root.shadowRoot.querySelector('.mdc-switch');
            expect(mdcSwitch.classList.contains('mdc-switch--selected')).toBe(
                true
            );
        });

        it('turns "off" when set to false via setProps', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-switch label="Active" value={true}></limel-switch>
            );
            await waitForChanges();

            setProps({ value: false });
            await waitForChanges();

            const mdcSwitch = root.shadowRoot.querySelector('.mdc-switch');
            expect(mdcSwitch.classList.contains('mdc-switch--selected')).toBe(
                false
            );
        });
    });

    describe('when the attribute `disabled`', () => {
        it('is enabled when not set', async () => {
            const { root, waitForChanges } = await render(
                <limel-switch label="Active"></limel-switch>
            );
            await waitForChanges();

            const mdcSwitch = root.shadowRoot.querySelector('.mdc-switch');
            expect(mdcSwitch.hasAttribute('disabled')).toBe(false);
            expect((root as any).disabled).toBeFalsy();
        });

        it('is disabled when set', async () => {
            const { root, waitForChanges } = await render(
                <limel-switch label="Active" disabled></limel-switch>
            );
            await waitForChanges();

            const mdcSwitch = root.shadowRoot.querySelector('.mdc-switch');
            expect(mdcSwitch.hasAttribute('disabled')).toBe(true);
            expect((root as any).disabled).toEqual(true);
        });

        it('becomes disabled when property changes to true', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-switch label="Active"></limel-switch>
            );
            await waitForChanges();

            setProps({ disabled: true });
            await waitForChanges();

            const mdcSwitch = root.shadowRoot.querySelector('.mdc-switch');
            expect(mdcSwitch.hasAttribute('disabled')).toBe(true);
        });

        it('becomes enabled when property changes to false', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-switch label="Active" disabled></limel-switch>
            );
            await waitForChanges();

            setProps({ disabled: false });
            await waitForChanges();

            const mdcSwitch = root.shadowRoot.querySelector('.mdc-switch');
            expect(mdcSwitch.hasAttribute('disabled')).toBe(false);
        });
    });
});
