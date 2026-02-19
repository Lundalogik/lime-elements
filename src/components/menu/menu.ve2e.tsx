import { render, h } from '@stencil/vitest';

describe('limel-menu', () => {
    const items = [
        {
            text: 'My fab menu item',
            secondaryText: 'Absolutely the best item!',
            selected: false,
        },
    ];

    it('opens when property `open` is set to `true`', async () => {
        const { root, waitForChanges, setProps } = await render(
            <limel-menu items={items}>
                <button slot="trigger">My Label</button>
            </limel-menu>
        );
        await waitForChanges();

        setProps({ open: true });
        await waitForChanges();

        expect((root as any).open).toBe(true);
        expect(root.hasAttribute('open')).toBe(true);
    });

    describe('button', () => {
        it('has the supplied label', async () => {
            const { root, waitForChanges } = await render(
                <limel-menu items={items}>
                    <button slot="trigger">My Label</button>
                </limel-menu>
            );
            await waitForChanges();

            const defaultButton = root.querySelector('button[slot="trigger"]');
            expect(defaultButton.textContent).toEqual('My Label');
        });

        it('sets the correct aria attributes on the trigger', async () => {
            const { root, waitForChanges } = await render(
                <limel-menu items={items}>
                    <button slot="trigger">My Label</button>
                </limel-menu>
            );
            await waitForChanges();

            const defaultButton = root.querySelector('button[slot="trigger"]');
            expect(defaultButton.getAttribute('aria-haspopup')).toBeTruthy();
            expect(defaultButton.getAttribute('role')).toEqual('button');
        });

        it('opens the menu when clicked', async () => {
            const { root, waitForChanges } = await render(
                <limel-menu items={items}>
                    <button slot="trigger">My Label</button>
                </limel-menu>
            );
            await waitForChanges();

            const defaultButton = root.querySelector('button[slot="trigger"]');
            (defaultButton as HTMLElement).click();
            await waitForChanges();

            expect((root as any).open).toBe(true);
        });

        it('closes the menu when clicked again', async () => {
            const { root, waitForChanges } = await render(
                <limel-menu items={items} open={true}>
                    <button slot="trigger">My Label</button>
                </limel-menu>
            );
            await waitForChanges();

            const defaultButton = root.querySelector('button[slot="trigger"]');
            (defaultButton as HTMLElement).click();
            await waitForChanges();

            expect((root as any).open).toBeFalsy();
        });

        describe('when property `disabled`', () => {
            it('is disabled when set', async () => {
                const { root, waitForChanges } = await render(
                    <limel-menu items={items} disabled={true}>
                        <button slot="trigger">My Label</button>
                    </limel-menu>
                );
                await waitForChanges();

                const defaultButton = root.querySelector(
                    'button[slot="trigger"]'
                );
                expect(defaultButton.hasAttribute('disabled')).toBe(true);
            });

            it('does NOT open the menu when disabled button is clicked', async () => {
                const { root, waitForChanges } = await render(
                    <limel-menu items={items} disabled={true}>
                        <button slot="trigger">My Label</button>
                    </limel-menu>
                );
                await waitForChanges();

                const defaultButton = root.querySelector(
                    'button[slot="trigger"]'
                );
                (defaultButton as HTMLElement).click();
                await waitForChanges();

                expect((root as any).open).toBeFalsy();
            });
        });
    });

    // Menu item selection tests are skipped — the menu uses a portal
    // which causes a classList null reference during teardown in the
    // Stencil vitest render environment. These interactions need full
    // Puppeteer/Playwright page-level tests.

    // Focus restoration and keyboard navigation tests are skipped —
    // they require real browser focus management (page.keyboard, page.focus)
    // which isn't available in the Stencil vitest render API.
});
