import { render, h } from '@stencil/vitest';

describe('limel-split-button', () => {
    describe('with a label', () => {
        it('inner limel-button displays the correct label', async () => {
            const { root, waitForChanges } = await render(
                <limel-split-button label="Save"></limel-split-button>
            );
            await waitForChanges();

            const limelButton = root.shadowRoot!.querySelector('limel-button');
            expect(limelButton.getAttribute('label')).toEqual('Save');
        });

        it('renders the new label when changed', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-split-button label="Save"></limel-split-button>
            );
            await waitForChanges();

            setProps({ label: 'new Label' });
            await waitForChanges();

            const limelButton = root.shadowRoot!.querySelector('limel-button');
            expect(limelButton.getAttribute('label')).toEqual('new Label');
        });
    });

    describe('when the attribute "primary"', () => {
        it('the inner button is not "primary" when not set', async () => {
            const { root, waitForChanges } = await render(
                <limel-split-button></limel-split-button>
            );
            await waitForChanges();

            const limelButton = root.shadowRoot!.querySelector('limel-button');
            expect((limelButton as any).primary).toBeFalsy();
        });

        it('the inner button is "primary" when set', async () => {
            const { root, waitForChanges } = await render(
                <limel-split-button primary></limel-split-button>
            );
            await waitForChanges();

            const limelButton = root.shadowRoot!.querySelector('limel-button');
            expect((limelButton as any).primary).toBe(true);
        });
    });

    describe('when the attribute "disabled"', () => {
        it('the inner button is not disabled when not set', async () => {
            const { root, waitForChanges } = await render(
                <limel-split-button></limel-split-button>
            );
            await waitForChanges();

            const limelButton = root.shadowRoot!.querySelector('limel-button');
            expect((limelButton as any).disabled).toBeFalsy();
        });

        it('the inner button is disabled when set', async () => {
            const { root, waitForChanges } = await render(
                <limel-split-button disabled></limel-split-button>
            );
            await waitForChanges();

            const limelButton = root.shadowRoot!.querySelector('limel-button');
            expect((limelButton as any).disabled).toBe(true);
        });
    });

    describe('when the attribute `icon`', () => {
        it('inner limel-button renders no icon when not set', async () => {
            const { root, waitForChanges } = await render(
                <limel-split-button></limel-split-button>
            );
            await waitForChanges();

            const limelButton = root.shadowRoot!.querySelector('limel-button');
            expect((limelButton as any).icon).toBeFalsy();
        });

        it('inner limel-button renders the icon when set', async () => {
            const { root, waitForChanges } = await render(
                <limel-split-button icon="unit-test"></limel-split-button>
            );
            await waitForChanges();

            const limelButton = root.shadowRoot!.querySelector('limel-button');
            expect((limelButton as any).icon).toBe('unit-test');
        });
    });

    describe('when the attribute `items`', () => {
        it('limel-menu is not displayed when not set', async () => {
            const { root, waitForChanges } = await render(
                <limel-split-button></limel-split-button>
            );
            await waitForChanges();

            const limelMenu = root.shadowRoot!.querySelector('limel-menu');
            expect(limelMenu).toBeNull();
        });

        it('limel-menu displays the values when set', async () => {
            const items = [
                { text: 'Later today', secondaryText: 'at 16:45' },
                { text: 'Tomorrow', secondaryText: 'at 08:00' },
            ];
            const { root, waitForChanges } = await render(
                <limel-split-button items={items}></limel-split-button>
            );
            await waitForChanges();

            const limelMenu = root.shadowRoot!.querySelector('limel-menu');
            expect((limelMenu as any).items).toEqual(items);
        });
    });
});
