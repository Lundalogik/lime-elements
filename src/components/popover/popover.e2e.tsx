import { render, h } from '@stencil/vitest';
import { vi } from 'vitest';

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

        await setProps({ open: false });
        await waitForChanges();

        expect((root as any).open).toBe(false);
    });

    describe('the document click listener', () => {
        const clickOutside = () => {
            const outside = document.createElement('button');
            document.body.append(outside);

            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            });
            outside.dispatchEvent(event);
            outside.remove();

            return event;
        };

        const pressEscape = () => {
            const event = new KeyboardEvent('keydown', {
                key: 'Escape',
                bubbles: true,
                cancelable: true,
            });
            document.dispatchEvent(event);

            return event;
        };

        it('swallows a click outside the popover while it is open', async () => {
            const { root, waitForChanges } = await render(
                <limel-popover open={true}>
                    <button slot="trigger" id="trigger">
                        Trigger
                    </button>
                    <button id="inside">Inside</button>
                </limel-popover>
            );
            await waitForChanges();

            const closeHandler = vi.fn();
            root.addEventListener('close', closeHandler);

            const event = clickOutside();
            await waitForChanges();

            expect(event.defaultPrevented).toBe(true);
            expect(closeHandler).toHaveBeenCalledTimes(1);
        });

        it('is gone once the popover is removed from the DOM while open', async () => {
            const { root, waitForChanges } = await render(
                <limel-popover open={true}>
                    <button slot="trigger" id="trigger">
                        Trigger
                    </button>
                    <button id="inside">Inside</button>
                </limel-popover>
            );
            await waitForChanges();

            const closeHandler = vi.fn();
            root.addEventListener('close', closeHandler);

            root.remove();
            await waitForChanges();

            expect(clickOutside().defaultPrevented).toBe(false);
            expect(pressEscape().defaultPrevented).toBe(false);
            expect(closeHandler).not.toHaveBeenCalled();
        });

        it('is not armed again by opening a popover that is no longer in the DOM', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-popover>
                    <button slot="trigger" id="trigger">
                        Trigger
                    </button>
                    <button id="inside">Inside</button>
                </limel-popover>
            );
            await waitForChanges();

            const closeHandler = vi.fn();
            root.addEventListener('close', closeHandler);

            root.remove();
            await waitForChanges();

            await setProps({ open: true });
            await waitForChanges();

            expect(clickOutside().defaultPrevented).toBe(false);
            expect(closeHandler).not.toHaveBeenCalled();
        });
    });
});
