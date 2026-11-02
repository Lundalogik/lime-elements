import { render, h } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';
import { getAccessibleProperties } from '../../util/test/accessibility-tree';

describe('limel-date-picker readonly state', () => {
    it('is announced as read only, and not as disabled', async () => {
        const { waitForChanges } = await render(
            <limel-date-picker
                label="When"
                type="date"
                value={new Date('2026-01-02T00:00:00')}
                readonly={true}
            />
        );
        await waitForChanges();

        expect(await getAccessibleProperties('textbox')).toEqual([
            expect.objectContaining({ readonly: true, disabled: false }),
        ]);
    });
});

describe('limel-date-picker keyboard', () => {
    async function setup() {
        const { root, waitForChanges } = await render(
            <limel-date-picker
                label="When"
                type="date"
                value={new Date('2026-01-02T00:00:00')}
            />
        );
        await waitForChanges();

        const details: Array<Date | null> = [];
        root.addEventListener('change', (event: CustomEvent<Date | null>) => {
            details.push(event.detail);
        });

        const input = root.shadowRoot
            .querySelector('limel-input-field')
            .shadowRoot.querySelector('input');

        return { root: root, input: input, details: details };
    }

    // Follows focus into the shadow roots, where the calendar's days are.
    function focusedElement(): Element | null {
        let element = document.activeElement;
        while (element?.shadowRoot?.activeElement) {
            element = element.shadowRoot.activeElement;
        }

        return element;
    }

    it('moves into the calendar with ArrowDown and picks a day with Enter', async () => {
        const { input, details } = await setup();
        await userEvent.click(input);

        await userEvent.keyboard('{ArrowDown}');
        await expect
            .poll(() => focusedElement()?.getAttribute('aria-label'))
            .toBe('January 2, 2026');

        await userEvent.keyboard('{ArrowRight}');
        await expect
            .poll(() => focusedElement()?.getAttribute('aria-label'))
            .toBe('January 3, 2026');

        await userEvent.keyboard('{Enter}');
        await expect.poll(() => details.length).toBe(1);

        expect(details[0].getDate()).toBe(3);
        await expect.poll(() => focusedElement()).toBe(input);
    });

    it('speaks the error when Enter does not commit the text', async () => {
        const { input, root } = await setup();
        await userEvent.click(input);

        await userEvent.clear(input);
        await userEvent.type(input, 'not a date');
        await userEvent.keyboard('{Enter}');

        const liveRegion = root.shadowRoot.querySelector('[aria-live]');
        await expect
            .poll(() => liveRegion.textContent)
            .toMatch(/^Enter a valid date \(\d\d\/\d\d\/\d{4}\)$/);
    });

    function isCalendarOpen(root: HTMLElement): boolean {
        return root.shadowRoot.querySelector('limel-portal').visible;
    }

    it.each(['{Escape}', '{Shift>}{Tab}{/Shift}'])(
        'goes back to the field from the calendar with %s',
        async (keys) => {
            const { input, root } = await setup();
            await userEvent.click(input);
            await userEvent.keyboard('{ArrowDown}');
            await expect
                .poll(() => focusedElement()?.getAttribute('aria-label'))
                .toBe('January 2, 2026');

            await userEvent.keyboard(keys);

            await expect.poll(() => focusedElement()).toBe(input);
            expect(isCalendarOpen(root)).toBe(true);
        }
    );

    it('throws away text typed just before Escape and keeps the calendar open', async () => {
        const { input, root, details } = await setup();
        await userEvent.click(input);

        await userEvent.clear(input);
        await userEvent.type(input, '13/45/2026');
        await userEvent.keyboard('{Escape}');
        // Longer than the input field waits before it emits typed text.
        await new Promise((resolve) => setTimeout(resolve, 500));

        expect(input.value).toBe('01/02/2026');
        expect(details).toEqual([]);
        expect(isCalendarOpen(root)).toBe(true);
    });

    it('closes the calendar with Escape when nothing is typed', async () => {
        const { input, root } = await setup();
        await userEvent.click(input);

        await userEvent.keyboard('{Escape}');

        await expect.poll(() => isCalendarOpen(root)).toBe(false);
        expect(focusedElement()).toBe(input);
    });

    it('commits typed text on Enter and keeps focus and the calendar', async () => {
        const { input, root, details } = await setup();
        await userEvent.click(input);

        await userEvent.clear(input);
        await userEvent.type(input, '01/24/2026');
        await userEvent.keyboard('{Enter}');

        await expect.poll(() => details.length).toBe(1);
        expect(details[0].getDate()).toBe(24);
        expect(focusedElement()).toBe(input);
        expect(isCalendarOpen(root)).toBe(true);
    });

    it('keeps focus in the field when Tab to the clear icon rejects the text', async () => {
        const { input } = await setup();
        await userEvent.click(input);

        await userEvent.clear(input);
        await userEvent.type(input, 'not a date');
        await userEvent.keyboard('{Tab}');

        await expect.poll(() => focusedElement()).toBe(input);
    });

    it('keeps focus in the field when Tab to the clear icon clears the value', async () => {
        const { input, root } = await setup();
        root.addEventListener('change', (event: CustomEvent<Date | null>) => {
            (root as HTMLLimelDatePickerElement).value = event.detail;
        });
        await userEvent.click(input);

        await userEvent.clear(input);
        await userEvent.keyboard('{Tab}');

        await expect.poll(() => focusedElement()).toBe(input);
    });
});
