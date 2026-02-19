import { render, h } from '@stencil/vitest';

describe('limel-tooltip', () => {
    async function setup() {
        const { root, waitForChanges } = await render(
            <div>
                <a id="tooltip-test">Testing tooltip</a>
                <limel-tooltip
                    elementId="tooltip-test"
                    label="Description"
                ></limel-tooltip>
            </div>
        );
        await waitForChanges();

        const anchor = root.querySelector('a');
        const tooltip = root.querySelector(
            'limel-tooltip'
        ) as HTMLLimelTooltipElement;

        return { root, anchor, tooltip, waitForChanges };
    }

    test('limel-portal is opened when the owner element is hovered', async () => {
        const { anchor, tooltip, waitForChanges } = await setup();

        anchor!.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

        // TooltipTimer has a 500ms delay before showing
        await new Promise((resolve) => setTimeout(resolve, 800));
        await waitForChanges();

        const portal = tooltip?.shadowRoot?.querySelector('limel-portal');
        expect((portal as any)?.visible).toBeTruthy();
    });
});
