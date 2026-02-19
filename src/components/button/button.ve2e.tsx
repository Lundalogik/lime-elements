import { render, h } from '@stencil/vitest';

describe('limel-button', () => {
    describe('with a label', () => {
        it('displays the correct label', async () => {
            const { root, waitForChanges } = await render(
                <limel-button label="Save"></limel-button>
            );
            await waitForChanges();

            const innerButton = root.shadowRoot.querySelector('button');
            expect(innerButton.textContent).toEqual('Save');
        });

        it('displays the new label when changed', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-button label="Save"></limel-button>
            );
            await waitForChanges();

            setProps({ label: 'new label' });
            await waitForChanges();

            const innerButton = root.shadowRoot.querySelector('button');
            expect(innerButton.textContent).toEqual('new label');
        });
    });

    describe('when the attribute `primary`', () => {
        it('is falsy when not set', async () => {
            const { root, waitForChanges } = await render(
                <limel-button label="Save"></limel-button>
            );
            await waitForChanges();
            expect((root as any).primary).toBeFalsy();
        });

        it('is true when set', async () => {
            const { root, waitForChanges } = await render(
                <limel-button label="Save" primary></limel-button>
            );
            await waitForChanges();
            expect((root as any).primary).toBe(true);
        });

        it('updates when property changes to true', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-button label="Save"></limel-button>
            );
            await waitForChanges();

            setProps({ primary: true });
            await waitForChanges();
            expect((root as any).primary).toBe(true);
        });

        it('updates when property changes to false', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-button label="Save" primary></limel-button>
            );
            await waitForChanges();

            setProps({ primary: false });
            await waitForChanges();
            expect((root as any).primary).toBeFalsy();
        });
    });

    describe('when the attribute `disabled`', () => {
        it('the inner button is enabled when not set', async () => {
            const { root, waitForChanges } = await render(
                <limel-button label="Save"></limel-button>
            );
            await waitForChanges();

            const innerButton = root.shadowRoot.querySelector('button');
            expect(innerButton.disabled).toBeFalsy();
            expect((root as any).disabled).toBeFalsy();
        });

        it('the inner button is disabled when set', async () => {
            const { root, waitForChanges } = await render(
                <limel-button label="Save" disabled></limel-button>
            );
            await waitForChanges();

            const innerButton = root.shadowRoot.querySelector('button');
            expect(innerButton.disabled).toBe(true);
            expect((root as any).disabled).toBe(true);
        });

        it('disables when property changes to true', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-button label="Save"></limel-button>
            );
            await waitForChanges();

            setProps({ disabled: true });
            await waitForChanges();

            const innerButton = root.shadowRoot.querySelector('button');
            expect(innerButton.disabled).toBe(true);
        });

        it('enables when property changes to false', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-button label="Save" disabled></limel-button>
            );
            await waitForChanges();

            setProps({ disabled: false });
            await waitForChanges();

            const innerButton = root.shadowRoot.querySelector('button');
            expect(innerButton.disabled).toBeFalsy();
        });
    });

    describe('when the attribute `loading`', () => {
        it('is not loading by default', async () => {
            const { root, waitForChanges } = await render(
                <limel-button label="Save"></limel-button>
            );
            await waitForChanges();

            const innerButton = root.shadowRoot.querySelector('button');
            expect(innerButton.classList.contains('loading')).toBe(false);
            expect(innerButton.classList.contains('just-loaded')).toBe(false);
            expect(innerButton.classList.contains('just-failed')).toBe(false);
            expect((root as any).loading).toBeFalsy();
        });

        it('shows loading state when set', async () => {
            const { root, waitForChanges } = await render(
                <limel-button label="Save" loading></limel-button>
            );
            await waitForChanges();

            const innerButton = root.shadowRoot.querySelector('button');
            expect(innerButton.classList.contains('loading')).toBe(true);
            expect((root as any).loading).toBe(true);
        });

        it('shows loading state when property changes to true', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-button label="Save"></limel-button>
            );
            await waitForChanges();

            setProps({ loading: true });
            await waitForChanges();

            const innerButton = root.shadowRoot.querySelector('button');
            expect(innerButton.classList.contains('loading')).toBe(true);
        });

        it('shows just-loaded state after loading completes', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-button label="Save" loading></limel-button>
            );
            await waitForChanges();

            setProps({ loading: false });
            await waitForChanges();

            const innerButton = root.shadowRoot.querySelector('button');
            expect(innerButton.classList.contains('loading')).toBe(false);
            expect(innerButton.classList.contains('just-loaded')).toBe(true);
        });

        it('shows just-failed state when loadingFailed is true', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-button label="Save" loading></limel-button>
            );
            await waitForChanges();

            setProps({ loading: false, loadingFailed: true });
            await waitForChanges();

            const innerButton = root.shadowRoot.querySelector('button');
            expect(innerButton.classList.contains('loading')).toBe(false);
            expect(innerButton.classList.contains('just-failed')).toBe(true);
        });
    });
});
