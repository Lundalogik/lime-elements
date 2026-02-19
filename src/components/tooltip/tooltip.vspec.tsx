vi.mock('./tooltip-timer', () => {
    return {
        TooltipTimer: vi
            .fn()
            .mockImplementation((showCallback, hideCallback) => {
                return {
                    showAfterDelay: vi.fn(() => showCallback()),
                    hide: vi.fn(() => hideCallback()),
                };
            }),
    };
});

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
        const content = tooltip?.shadowRoot?.querySelector(
            'limel-tooltip-content'
        );
        const portal = tooltip?.shadowRoot?.querySelector('limel-portal');

        return { root, anchor, tooltip, content, portal, waitForChanges };
    }

    test('the component renders', async () => {
        const { tooltip } = await setup();
        expect(tooltip).toBeDefined();
        expect(tooltip.shadowRoot).toBeTruthy();
    });

    test('aria-describedby is set on the anchor', async () => {
        const { anchor } = await setup();
        expect(anchor.getAttribute('aria-describedby')).toBeTruthy();
    });

    test('aria-hidden is set when the owner element is NOT hovered', async () => {
        const { content } = await setup();
        expect(content?.hasAttribute('aria-hidden')).toBe(true);
    });

    test('aria-hidden is removed when the owner element is hovered', async () => {
        const { anchor, tooltip, waitForChanges } = await setup();
        const event = new MouseEvent('mouseover', { bubbles: true });
        anchor!.dispatchEvent(event);
        await waitForChanges();

        const content = tooltip?.shadowRoot?.querySelector(
            'limel-tooltip-content'
        );
        expect(content?.getAttribute('aria-hidden')).not.toBe('true');
    });
});
