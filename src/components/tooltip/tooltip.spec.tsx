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
    async function setup(
        props: { hotkey?: string; helperLabel?: string } = {}
    ) {
        const { root, waitForChanges } = await render(
            <div>
                <a id="tooltip-test">Testing tooltip</a>
                <limel-tooltip
                    elementId="tooltip-test"
                    label="Description"
                    {...props}
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
        const hotkey = content?.shadowRoot?.querySelector('limel-hotkey');

        return {
            root,
            anchor,
            tooltip,
            content,
            portal,
            hotkey,
            waitForChanges,
        };
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
        expect(content).not.toBeNull();
        expect(content!.hasAttribute('aria-hidden')).toBe(true);
    });

    test('aria-hidden is removed when the owner element is hovered', async () => {
        const { anchor, tooltip, waitForChanges } = await setup();
        const event = new MouseEvent('mouseover', { bubbles: true });
        anchor!.dispatchEvent(event);
        await waitForChanges();

        const content = tooltip?.shadowRoot?.querySelector(
            'limel-tooltip-content'
        );
        expect(content).not.toBeNull();
        expect(content!.getAttribute('aria-hidden')).not.toBe('true');
    });

    describe('hotkey prop', () => {
        test('does not render limel-hotkey when hotkey is not set', async () => {
            const { hotkey } = await setup();
            expect(hotkey).toBeFalsy();
        });

        test('renders limel-hotkey when hotkey is set', async () => {
            const { hotkey } = await setup({ hotkey: 'ctrl+f' });
            expect(hotkey).toBeTruthy();
            expect(hotkey!.getAttribute('value')).toBe('ctrl+f');
        });

        test('normalizes the hotkey string before passing it on', async () => {
            const { hotkey } = await setup({ hotkey: 'CMD+Enter' });
            expect(hotkey).toBeTruthy();
            expect(hotkey!.getAttribute('value')).toBe('meta+enter');
        });

        test('does not render limel-hotkey for an invalid hotkey', async () => {
            const { hotkey } = await setup({ hotkey: 'ctrl+' });
            expect(hotkey).toBeFalsy();
        });
    });
});
