import { render, h } from '@stencil/vitest';
import {
    getAccessibleNodes,
    getInvalidStates,
} from '../../util/test/accessibility-tree';

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

            await setProps({ label: 'new label' });
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

            const switchEl = root.shadowRoot.querySelector('button');
            expect(switchEl.getAttribute('aria-checked')).toBe('false');
            expect((root as any).value).toBeFalsy();
        });

        it('is "on" when set to true', async () => {
            const { root, waitForChanges } = await render(
                <limel-switch label="Active" value={true}></limel-switch>
            );
            await waitForChanges();

            const switchEl = root.shadowRoot.querySelector('button');
            expect(switchEl.getAttribute('aria-checked')).toBe('true');
            expect((root as any).value).toEqual(true);
        });

        it('turns "on" when set to true via setProps', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-switch label="Active"></limel-switch>
            );
            await waitForChanges();

            await setProps({ value: true });
            await waitForChanges();

            const switchEl = root.shadowRoot.querySelector('button');
            expect(switchEl.getAttribute('aria-checked')).toBe('true');
        });

        it('turns "off" when set to false via setProps', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-switch label="Active" value={true}></limel-switch>
            );
            await waitForChanges();

            await setProps({ value: false });
            await waitForChanges();

            const switchEl = root.shadowRoot.querySelector('button');
            expect(switchEl.getAttribute('aria-checked')).toBe('false');
        });
    });

    describe('when the attribute `disabled`', () => {
        it('is enabled when not set', async () => {
            const { root, waitForChanges } = await render(
                <limel-switch label="Active"></limel-switch>
            );
            await waitForChanges();

            const switchEl = root.shadowRoot.querySelector('button');
            expect(switchEl.hasAttribute('disabled')).toBe(false);
            expect((root as any).disabled).toBeFalsy();
        });

        it('is disabled when set', async () => {
            const { root, waitForChanges } = await render(
                <limel-switch label="Active" disabled></limel-switch>
            );
            await waitForChanges();

            const switchEl = root.shadowRoot.querySelector('button');
            expect(switchEl.hasAttribute('disabled')).toBe(true);
            expect((root as any).disabled).toEqual(true);
        });

        it('becomes disabled when property changes to true', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-switch label="Active"></limel-switch>
            );
            await waitForChanges();

            await setProps({ disabled: true });
            await waitForChanges();

            const switchEl = root.shadowRoot.querySelector('button');
            expect(switchEl.hasAttribute('disabled')).toBe(true);
        });

        it('becomes enabled when property changes to false', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-switch label="Active" disabled></limel-switch>
            );
            await waitForChanges();

            await setProps({ disabled: false });
            await waitForChanges();

            const switchEl = root.shadowRoot.querySelector('button');
            expect(switchEl.hasAttribute('disabled')).toBe(false);
        });
    });
});

describe('limel-switch accessible description', () => {
    it('is the helper text', async () => {
        const { waitForChanges } = await render(
            <limel-switch label="Active" helperText="Visible to everyone" />
        );
        await waitForChanges();

        expect(await getAccessibleNodes('switch')).toEqual([
            { name: 'Active', description: 'Visible to everyone' },
        ]);
    });
});

describe('limel-switch invalid state', () => {
    it('is not invalid by default', async () => {
        const { waitForChanges } = await render(
            <limel-switch label="Notifications" />
        );
        await waitForChanges();

        expect(await getInvalidStates('switch')).toEqual([false]);
    });

    it('is invalid when the switch is', async () => {
        const { waitForChanges } = await render(
            <limel-switch label="Notifications" invalid={true} />
        );
        await waitForChanges();

        expect(await getInvalidStates('switch')).toEqual([true]);
    });
});
