import { render, h } from '@stencil/vitest';
import { vi } from 'vitest';

describe('limel-slider — unset & clear', () => {
    async function setup(props: Record<string, any> = {}) {
        const { root, waitForChanges } = await render(
            <limel-slider {...props}></limel-slider>
        );
        await waitForChanges();

        return { root, waitForChanges };
    }

    const indicator = (root: any): HTMLElement =>
        root.shadowRoot?.querySelector('.indicator');
    const rangeInput = (root: any): HTMLInputElement =>
        root.shadowRoot?.querySelector('input[type="range"]');
    const clearButton = (root: any): HTMLButtonElement =>
        root.shadowRoot?.querySelector('button.clear-button');

    describe('unset state', () => {
        it('treats a non-finite value as unset', async () => {
            const { root } = await setup({
                label: 'Priority',
                value: Number.NaN,
                valuemin: 1,
                valuemax: 5,
            });

            expect(root.classList.contains('is-unset')).toBe(true);
            expect(indicator(root).textContent).toBe('\u2194\uFE0E');
            expect(rangeInput(root).getAttribute('aria-valuetext')).toBe(
                'Value not set'
            );
        });

        it('rests the thumb at the midpoint while unset, not at the minimum', async () => {
            const { root } = await setup({
                value: Number.NaN,
                valuemin: 0,
                valuemax: 10,
            });

            // The native input sits at the midpoint (not the minimum), so both
            // arrow-key directions are live and there is no jump on first use.
            expect(rangeInput(root).value).toBe('5');
        });

        it('treats a finite value, including 0, as set', async () => {
            const { root } = await setup({
                value: 0,
                valuemin: -10,
                valuemax: 10,
            });

            expect(root.classList.contains('is-unset')).toBe(false);
            expect(indicator(root).textContent).toBe('0');
            expect(rangeInput(root).getAttribute('aria-valuetext')).toBeNull();
        });

        it('becomes unset again when the value is reset to a non-finite number', async () => {
            const { root, waitForChanges } = await setup({
                value: 3,
                valuemin: 1,
                valuemax: 5,
            });
            expect(root.classList.contains('is-unset')).toBe(false);

            (root as any).value = Number.NaN;
            await waitForChanges();

            expect(root.classList.contains('is-unset')).toBe(true);
            expect(indicator(root).textContent).toBe('\u2194\uFE0E');
        });

        it('leaves the unset state as soon as the user changes the value', async () => {
            const { root, waitForChanges } = await setup({
                value: Number.NaN,
                valuemin: 1,
                valuemax: 5,
                step: 1,
            });
            expect(root.classList.contains('is-unset')).toBe(true);

            const input = rangeInput(root);
            input.value = '3';
            input.dispatchEvent(new Event('input'));
            await waitForChanges();

            expect(root.classList.contains('is-unset')).toBe(false);
            expect(indicator(root).textContent).toBe('3');
        });
    });

    describe('clear button', () => {
        it('labels the button with the slider label, falling back to a generic label', async () => {
            const withLabel = await setup({ label: 'Priority', value: 3 });
            expect(clearButton(withLabel.root).getAttribute('aria-label')).toBe(
                'Clear value of Priority'
            );

            const withoutLabel = await setup({ value: 3 });
            expect(
                clearButton(withoutLabel.root).getAttribute('aria-label')
            ).toBe('Clear value');
        });

        it('disables the clear button while unset, and enables it once set', async () => {
            const unset = await setup({
                label: 'Priority',
                value: Number.NaN,
                valuemin: 1,
                valuemax: 5,
            });
            expect(clearButton(unset.root).hasAttribute('disabled')).toBe(true);

            const set = await setup({
                label: 'Priority',
                value: 3,
                valuemin: 1,
                valuemax: 5,
            });
            expect(clearButton(set.root).hasAttribute('disabled')).toBe(false);
        });

        it('offers no clear button for required or readonly sliders', async () => {
            const required = await setup({
                label: 'Priority',
                required: true,
                value: 3,
            });
            expect(clearButton(required.root)).toBeNull();

            const readonly = await setup({
                label: 'Priority',
                readonly: true,
                value: 3,
            });
            expect(clearButton(readonly.root)).toBeNull();
        });
    });

    describe('clearing', () => {
        it('emits change with NaN and enters the unset state', async () => {
            const { root, waitForChanges } = await setup({
                label: 'Priority',
                value: 3,
                valuemin: 1,
                valuemax: 5,
            });

            const details: number[] = [];
            root.addEventListener('change', (event: CustomEvent<number>) => {
                details.push(event.detail);
            });

            clearButton(root).click();
            await waitForChanges();

            expect(details).toHaveLength(1);
            expect(Number.isNaN(details[0])).toBe(true);
            expect(root.classList.contains('is-unset')).toBe(true);
        });

        it('moves focus to the slider input when cleared', async () => {
            const { root, waitForChanges } = await setup({
                label: 'Priority',
                value: 3,
                valuemin: 1,
                valuemax: 5,
            });

            const focusSpy = vi.spyOn(rangeInput(root), 'focus');

            clearButton(root).click();
            await waitForChanges();

            expect(focusSpy).toHaveBeenCalled();
        });
    });
});
