import { render, h } from '@stencil/vitest';
import { vi } from 'vitest';

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

        await setProps({ open: true });
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
            expect(defaultButton.getAttribute('aria-haspopup')).toBe('true');
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
    // page-level tests.

    // Focus restoration and keyboard navigation tests are skipped —
    // they require real browser focus management (page.keyboard, page.focus)
    // which isn't available in the Stencil vitest render API.

    describe('hotkeys', () => {
        it('selects the matching item when a hotkey is pressed while the menu is open', async () => {
            const hotkeyItems = [
                { text: 'Copy', hotkey: 'alt+c' },
                { text: 'Cut', hotkey: 'alt+x' },
            ];

            const { root, waitForChanges } = await render(
                <limel-menu items={hotkeyItems}>
                    <button slot="trigger">Menu</button>
                </limel-menu>
            );
            await waitForChanges();

            const handler = vi.fn();
            root.addEventListener('select', (e: Event) =>
                handler((e as CustomEvent).detail)
            );

            // Open the menu
            const trigger = root.querySelector(
                'button[slot="trigger"]'
            ) as HTMLElement;
            trigger.click();
            await waitForChanges();

            // Find the menu surface (rendered via portal on document.body)
            const surface = document.querySelector('limel-menu-surface');
            expect(surface).toBeTruthy();

            // Dispatch the hotkey on the surface
            surface!.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'c',
                    code: 'KeyC',
                    altKey: true,
                    bubbles: true,
                    composed: true,
                })
            );
            await waitForChanges();

            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith(
                expect.objectContaining({ text: 'Copy' })
            );

            // Menu should close after selection
            expect((root as any).open).toBeFalsy();
        });

        it('does not allow reserved keys (Enter) to be used as item hotkeys', async () => {
            const hotkeyItems = [
                { text: 'First' },
                {
                    text: 'Second (should not steal Enter)',
                    hotkey: 'enter',
                },
            ];

            const { root, waitForChanges } = await render(
                <limel-menu items={hotkeyItems} open={true}>
                    <button slot="trigger">Menu</button>
                </limel-menu>
            );
            await waitForChanges();

            const handler = vi.fn();
            root.addEventListener('select', (e: Event) =>
                handler((e as CustomEvent).detail)
            );

            const surface = document.querySelector('limel-menu-surface');
            expect(surface).toBeTruthy();

            // Enter is reserved — should NOT trigger the "Second" item's hotkey
            surface!.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    bubbles: true,
                    composed: true,
                })
            );
            await waitForChanges();

            // Enter on a reserved key should not trigger the hotkey handler
            // (it may activate the focused item via native menu behavior,
            // but should not match the "enter" hotkey on the second item)
            const calls = handler.mock.calls;
            for (const [detail] of calls) {
                expect(detail.text).not.toBe('Second (should not steal Enter)');
            }
        });

        it('does not trigger hotkey selection for reserved arrow keys', async () => {
            const hotkeyItems = [
                { text: 'Down (reserved)', hotkey: 'arrowdown' },
                { text: 'Another item' },
            ];

            const { root, waitForChanges } = await render(
                <limel-menu items={hotkeyItems} open={true}>
                    <button slot="trigger">Menu</button>
                </limel-menu>
            );
            await waitForChanges();

            const handler = vi.fn();
            root.addEventListener('select', (e: Event) =>
                handler((e as CustomEvent).detail)
            );

            const surface = document.querySelector('limel-menu-surface');
            expect(surface).toBeTruthy();

            // ArrowDown is reserved for navigation, not hotkey activation
            surface!.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'ArrowDown',
                    code: 'ArrowDown',
                    bubbles: true,
                    composed: true,
                })
            );
            await waitForChanges();

            expect(handler).not.toHaveBeenCalled();
        });

        it('allows modified arrow key combos as item hotkeys', async () => {
            const hotkeyItems = [
                { text: 'Alt+Down action', hotkey: 'alt+arrowdown' },
                { text: 'Another item' },
            ];

            const { root, waitForChanges } = await render(
                <limel-menu items={hotkeyItems} open={true}>
                    <button slot="trigger">Menu</button>
                </limel-menu>
            );
            await waitForChanges();

            const handler = vi.fn();
            root.addEventListener('select', (e: Event) =>
                handler((e as CustomEvent).detail)
            );

            const surface = document.querySelector('limel-menu-surface');
            expect(surface).toBeTruthy();

            surface!.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'ArrowDown',
                    code: 'ArrowDown',
                    altKey: true,
                    bubbles: true,
                    composed: true,
                })
            );
            await waitForChanges();

            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith(
                expect.objectContaining({ text: 'Alt+Down action' })
            );
        });

        it('triggers modified hotkeys while search input is focused', async () => {
            const searchableItems = [
                { text: 'Apply first', hotkey: 'ctrl+enter' },
            ];
            const searcher = vi.fn().mockResolvedValue(searchableItems);

            const { root, waitForChanges } = await render(
                <limel-menu searcher={searcher} open={true}>
                    <button slot="trigger">Menu</button>
                </limel-menu>
            );
            await waitForChanges();

            const handler = vi.fn();
            root.addEventListener('select', (e: Event) =>
                handler((e as CustomEvent).detail)
            );

            const surface = document.querySelector('limel-menu-surface');
            expect(surface).toBeTruthy();

            const input =
                surface?.querySelector('limel-input-field') ||
                surface?.shadowRoot?.querySelector('limel-input-field');
            expect(input).toBeTruthy();

            input!.dispatchEvent(
                new CustomEvent('change', {
                    detail: 'a',
                    bubbles: true,
                    composed: true,
                })
            );
            await waitForChanges();

            input!.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    ctrlKey: true,
                    bubbles: true,
                    composed: true,
                })
            );
            await waitForChanges();

            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith(
                expect.objectContaining({ text: 'Apply first' })
            );
        });

        it('does not trigger hotkey selection for disabled items', async () => {
            const hotkeyItems = [
                { text: 'Enabled action', hotkey: 'e' },
                { text: 'Disabled action', hotkey: 'd', disabled: true },
            ];

            const { root, waitForChanges } = await render(
                <limel-menu items={hotkeyItems} open={true}>
                    <button slot="trigger">Menu</button>
                </limel-menu>
            );
            await waitForChanges();

            const handler = vi.fn();
            root.addEventListener('select', (e: Event) =>
                handler((e as CustomEvent).detail)
            );

            const surface = document.querySelector('limel-menu-surface');
            expect(surface).toBeTruthy();

            // Press the disabled item's hotkey
            surface!.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'd',
                    code: 'KeyD',
                    bubbles: true,
                    composed: true,
                })
            );
            await waitForChanges();

            expect(handler).not.toHaveBeenCalled();
        });

        it('does not trigger alt-only hotkeys while search input is focused', async () => {
            // Alt is excluded from hasModifier to support international
            // keyboard input (Option+e for é, AltGr+e for €). This means
            // alt-only hotkeys won't fire from text inputs — only Ctrl/Meta
            // combos will.
            const searchableItems = [{ text: 'Alt action', hotkey: 'alt+x' }];
            const searcher = vi.fn().mockResolvedValue(searchableItems);

            const { root, waitForChanges } = await render(
                <limel-menu searcher={searcher} open={true}>
                    <button slot="trigger">Menu</button>
                </limel-menu>
            );
            await waitForChanges();

            const handler = vi.fn();
            root.addEventListener('select', (e: Event) =>
                handler((e as CustomEvent).detail)
            );

            const surface = document.querySelector('limel-menu-surface');
            expect(surface).toBeTruthy();

            const input =
                surface?.querySelector('limel-input-field') ||
                surface?.shadowRoot?.querySelector('limel-input-field');
            expect(input).toBeTruthy();

            // Trigger search so items appear
            input!.dispatchEvent(
                new CustomEvent('change', {
                    detail: 'a',
                    bubbles: true,
                    composed: true,
                })
            );
            await waitForChanges();

            // Find the native <input> inside limel-input-field's shadow DOM.
            // isFromTextInput checks composedPath() for INPUT/TEXTAREA/SELECT,
            // so the event must originate from the native element, not the
            // custom element wrapper.
            const nativeInput =
                input!.shadowRoot?.querySelector('input') ?? input!;

            // Alt+X from within the text input should NOT trigger the hotkey
            // because Alt alone is not treated as a modifier (to allow
            // special character input on international keyboards)
            nativeInput.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'x',
                    code: 'KeyX',
                    altKey: true,
                    bubbles: true,
                    composed: true,
                })
            );
            await waitForChanges();

            expect(handler).not.toHaveBeenCalled();
        });

        it('selects the first match when multiple items have the same hotkey', async () => {
            const hotkeyItems = [
                { text: 'First duplicate', hotkey: 'k' },
                { text: 'Second duplicate', hotkey: 'k' },
            ];

            const { root, waitForChanges } = await render(
                <limel-menu items={hotkeyItems} open={true}>
                    <button slot="trigger">Menu</button>
                </limel-menu>
            );
            await waitForChanges();

            const handler = vi.fn();
            root.addEventListener('select', (e: Event) =>
                handler((e as CustomEvent).detail)
            );

            const surface = document.querySelector('limel-menu-surface');
            expect(surface).toBeTruthy();

            surface!.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'k',
                    code: 'KeyK',
                    bubbles: true,
                    composed: true,
                })
            );
            await waitForChanges();

            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith(
                expect.objectContaining({ text: 'First duplicate' })
            );
        });

        it('only matches hotkeys against the currently visible menu level', async () => {
            const hotkeyItems = [
                {
                    text: 'Parent with sub-menu',
                    hotkey: 'p',
                    items: [{ text: 'Child action', hotkey: 'c' }],
                },
                { text: 'Root action', hotkey: 'c' },
            ];

            const { root, waitForChanges } = await render(
                <limel-menu items={hotkeyItems} open={true}>
                    <button slot="trigger">Menu</button>
                </limel-menu>
            );
            await waitForChanges();

            const handler = vi.fn();
            root.addEventListener('select', (e: Event) =>
                handler((e as CustomEvent).detail)
            );

            const surface = document.querySelector('limel-menu-surface');
            expect(surface).toBeTruthy();

            // At root level, pressing 'c' should match "Root action",
            // not the child item "Child action" which is not visible
            surface!.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'c',
                    code: 'KeyC',
                    bubbles: true,
                    composed: true,
                })
            );
            await waitForChanges();

            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith(
                expect.objectContaining({ text: 'Root action' })
            );
        });

        it('does not trigger hotkey on repeated (held-down) key events', async () => {
            const hotkeyItems = [{ text: 'Action', hotkey: 'k' }];

            const { root, waitForChanges } = await render(
                <limel-menu items={hotkeyItems} open={true}>
                    <button slot="trigger">Menu</button>
                </limel-menu>
            );
            await waitForChanges();

            const handler = vi.fn();
            root.addEventListener('select', (e: Event) =>
                handler((e as CustomEvent).detail)
            );

            const surface = document.querySelector('limel-menu-surface');
            expect(surface).toBeTruthy();

            // Held-down keys fire with repeat: true — these should be ignored
            surface!.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'k',
                    code: 'KeyK',
                    repeat: true,
                    bubbles: true,
                    composed: true,
                })
            );
            await waitForChanges();

            expect(handler).not.toHaveBeenCalled();
        });
    });
});
