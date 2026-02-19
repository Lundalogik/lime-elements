import { render, h } from '@stencil/vitest';

describe('limel-popover', () => {
    // Focus restoration and dismiss-on-Escape/outside-click tests require
    // real browser focus management (page.keyboard.press, page.focus, page.click)
    // which isn't available in the Stencil vitest render API.
    // These tests verify basic open/close state behavior.

    it('renders open when open prop is true', async () => {
        const { root, waitForChanges } = await render(
            <limel-popover open={true}>
                <button slot="trigger" id="trigger">
                    Trigger
                </button>
                <button id="inside">Inside</button>
            </limel-popover>
        );
        await waitForChanges();

        expect((root as any).open).toBe(true);
    });

    it('closes when open is set to false programmatically', async () => {
        const { root, waitForChanges, setProps } = await render(
            <limel-popover open={true}>
                <button slot="trigger" id="trigger">
                    Trigger
                </button>
                <button id="inside">Inside</button>
            </limel-popover>
        );
        await waitForChanges();

        setProps({ open: false });
        await waitForChanges();

        expect((root as any).open).toBe(false);
    });
});
