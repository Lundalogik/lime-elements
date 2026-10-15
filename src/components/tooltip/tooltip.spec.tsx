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

    describe('description of the owner element', () => {
        test('is the label', async () => {
            const { anchor } = await setup();
            expect(anchor.getAttribute('aria-description')).toBe('Description');
        });

        test('includes the helper label', async () => {
            const { anchor } = await setup({ helperLabel: 'More details' });
            expect(anchor.getAttribute('aria-description')).toBe(
                'Description. More details'
            );
        });

        test('ends with the hotkey written out in words', async () => {
            const { anchor } = await setup({ hotkey: 'shift+k' });
            expect(anchor.getAttribute('aria-description')).toBe(
                'Description. Shift k'
            );
        });

        test('is updated when the hotkey changes', async () => {
            const { anchor, tooltip, waitForChanges } = await setup({
                hotkey: 'shift+k',
            });
            tooltip.hotkey = 'shift+j';
            await waitForChanges();

            expect(anchor.getAttribute('aria-description')).toBe(
                'Description. Shift j'
            );
        });

        test('does not refer to an element by id', async () => {
            const { anchor } = await setup();
            expect(anchor.hasAttribute('aria-describedby')).toBe(false);
        });

        test('is updated when the label changes', async () => {
            const { anchor, tooltip, waitForChanges } = await setup();
            tooltip.label = 'Other description';
            await waitForChanges();

            expect(anchor.getAttribute('aria-description')).toBe(
                'Other description'
            );
        });

        test('is updated when the helper label changes', async () => {
            const { anchor, tooltip, waitForChanges } = await setup();
            tooltip.helperLabel = 'More details';
            await waitForChanges();

            expect(anchor.getAttribute('aria-description')).toBe(
                'Description. More details'
            );
        });

        test('is removed when the tooltip is removed', async () => {
            const { anchor, tooltip, waitForChanges } = await setup();
            expect(anchor.hasAttribute('aria-description')).toBe(true);

            tooltip.remove();
            await waitForChanges();

            expect(anchor.hasAttribute('aria-description')).toBe(false);
        });
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
