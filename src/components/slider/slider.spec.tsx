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
        it('treats a null value as unset', async () => {
            const { root } = await setup({
                label: 'Priority',
                value: null,
                valuemin: 1,
                valuemax: 5,
            });

            expect(root.classList.contains('is-unset')).toBe(true);
            expect(indicator(root).textContent).toBe('\u2194\uFE0E');
            expect(rangeInput(root).getAttribute('aria-valuetext')).toBe(
                'Value not set'
            );
        });

        it.each([
            ['NaN', Number.NaN],
            ['undefined', undefined],
        ])('also treats %s as unset', async (_name, value) => {
            const { root } = await setup({ value, valuemin: 1, valuemax: 5 });

            expect(root.classList.contains('is-unset')).toBe(true);
        });

        it('rests the thumb at the midpoint while unset, not at the minimum', async () => {
            const { root } = await setup({
                value: null,
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

        it('becomes unset again when the value is reset to null', async () => {
            const { root, waitForChanges } = await setup({
                value: 3,
                valuemin: 1,
                valuemax: 5,
            });
            expect(root.classList.contains('is-unset')).toBe(false);

            (root as any).value = null;
            await waitForChanges();

            expect(root.classList.contains('is-unset')).toBe(true);
            expect(indicator(root).textContent).toBe('\u2194\uFE0E');
        });

        it('leaves the unset state as soon as the user changes the value', async () => {
            const { root, waitForChanges } = await setup({
                value: null,
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
                value: null,
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

        it('marks the host whenever the clear button is rendered', async () => {
            // The stylesheet reserves room for the button off this class, so
            // it has to track the button itself rather than the attributes.
            const clearable = await setup({ value: 3 });
            expect(clearButton(clearable.root)).not.toBeNull();
            expect(clearable.root.classList.contains('has-clear-button')).toBe(
                true
            );

            for (const props of [{ required: true }, { readonly: true }]) {
                const { root } = await setup({ value: 3, ...props });
                expect(clearButton(root)).toBeNull();
                expect(root.classList.contains('has-clear-button')).toBe(false);
            }
        });

        it('keeps the button and the reserved room in step for required="false"', async () => {
            // Stencil parses the attribute string "false" into `false`, so the
            // button is rendered — a stylesheet matching on `[required]` would
            // reserve nothing for it. Vue templates emit exactly this.
            const { root } = await render(
                <limel-slider value={3} attr:required="false"></limel-slider>
            );

            expect(clearButton(root)).not.toBeNull();
            expect(root.classList.contains('has-clear-button')).toBe(true);
        });
    });

    describe('clearing', () => {
        it('emits change with null and enters the unset state', async () => {
            const { root, waitForChanges } = await setup({
                label: 'Priority',
                value: 3,
                valuemin: 1,
                valuemax: 5,
            });

            const details: Array<number | null> = [];
            root.addEventListener(
                'change',
                (event: CustomEvent<number | null>) => {
                    details.push(event.detail);
                }
            );

            clearButton(root).click();
            await waitForChanges();

            expect(details).toHaveLength(1);
            expect(details[0]).toBeNull();
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

    describe('setting a value by pressing on the track', () => {
        // While unset the native input already rests at the midpoint, so a
        // press that lands on that same value changes nothing and the browser
        // fires neither `input` nor `change` — only `click`. These tests drive
        // that sequence, since a synthetic `input` event would hide the bug.
        async function setupUnset() {
            const context = await setup({
                value: null,
                valuemin: 1,
                valuemax: 5,
                step: 1,
            });
            const details: Array<number | null> = [];
            context.root.addEventListener(
                'change',
                (event: CustomEvent<number | null>) => {
                    details.push(event.detail);
                }
            );

            // The thumb rests at the step-aligned midpoint of 1–5.
            expect(rangeInput(context.root).value).toBe('3');
            expect(context.root.classList.contains('is-unset')).toBe(true);

            return { ...context, details };
        }

        it('sets the value when the press lands on the resting position', async () => {
            const { root, waitForChanges, details } = await setupUnset();

            rangeInput(root).dispatchEvent(new Event('click'));
            await waitForChanges();

            expect(details).toEqual([3]);
            expect(root.classList.contains('is-unset')).toBe(false);
            expect(indicator(root).textContent).toBe('3');
        });

        it('sets the value when a drag returns to the resting position', async () => {
            const { root, waitForChanges, details } = await setupUnset();
            const input = rangeInput(root);

            // Drag away from the midpoint and back before releasing. `input`
            // fires along the way, but the released value equals the value the
            // drag started at, so the browser fires no `change`.
            input.value = '5';
            input.dispatchEvent(new Event('input'));
            input.value = '3';
            input.dispatchEvent(new Event('input'));
            input.dispatchEvent(new Event('click'));
            await waitForChanges();

            expect(details).toEqual([3]);
            expect(root.classList.contains('is-unset')).toBe(false);
        });

        it('emits change only once when the press does move the value', async () => {
            const { root, waitForChanges, details } = await setupUnset();
            const input = rangeInput(root);

            input.value = '5';
            input.dispatchEvent(new Event('input'));
            input.dispatchEvent(new Event('change'));
            input.dispatchEvent(new Event('click'));
            await waitForChanges();

            expect(details).toEqual([5]);
        });

        it('does not emit when a press on an already set slider changes nothing', async () => {
            const { root, waitForChanges } = await setup({
                value: 3,
                valuemin: 1,
                valuemax: 5,
                step: 1,
            });
            const details: Array<number | null> = [];
            root.addEventListener(
                'change',
                (event: CustomEvent<number | null>) => {
                    details.push(event.detail);
                }
            );

            rangeInput(root).dispatchEvent(new Event('click'));
            await waitForChanges();

            expect(details).toEqual([]);
        });

        it('keeps the value on a step when the range does not start on one', async () => {
            // A 1–5 range in steps of 2 stops at 1, 3 and 5. Steps count from
            // `valuemin`, so none of those is a multiple of the step itself.
            const { root, waitForChanges } = await setup({
                value: null,
                valuemin: 1,
                valuemax: 5,
                step: 2,
            });
            const details: Array<number | null> = [];
            root.addEventListener(
                'change',
                (event: CustomEvent<number | null>) => {
                    details.push(event.detail);
                }
            );

            const input = rangeInput(root);
            expect(input.value).toBe('3');

            input.dispatchEvent(new Event('click'));
            await waitForChanges();

            expect(details).toEqual([3]);
            expect(indicator(root).textContent).toBe('3');
        });

        it('emits the stops of an offset range unchanged', async () => {
            const { root, waitForChanges } = await setup({
                value: 1,
                valuemin: 1,
                valuemax: 5,
                step: 2,
            });
            const details: Array<number | null> = [];
            root.addEventListener(
                'change',
                (event: CustomEvent<number | null>) => {
                    details.push(event.detail);
                }
            );

            const input = rangeInput(root);
            for (const stop of ['1', '3', '5']) {
                input.value = stop;
                input.dispatchEvent(new Event('input'));
                input.dispatchEvent(new Event('change'));
            }

            await waitForChanges();

            // Never rounded up past `valuemax`.
            expect(details).toEqual([1, 3, 5]);
        });

        it('rests at the factored midpoint and emits the unfactored value', async () => {
            // `form/widgets/slider.ts` sets factor 100 for percent schemas, so
            // the native input works in whole percent while `change` carries
            // the 0-1 fraction back out.
            const { root, waitForChanges } = await setup({
                value: null,
                valuemin: 0,
                valuemax: 1,
                step: 0.1,
                factor: 100,
            });
            const details: Array<number | null> = [];
            root.addEventListener(
                'change',
                (event: CustomEvent<number | null>) => {
                    details.push(event.detail);
                }
            );

            expect(root.classList.contains('is-unset')).toBe(true);
            expect(rangeInput(root).value).toBe('50');

            rangeInput(root).dispatchEvent(new Event('click'));
            await waitForChanges();

            expect(details).toEqual([0.5]);
            expect(indicator(root).textContent).toBe('50');
        });

        it('clears a factored slider back to null', async () => {
            const { root, waitForChanges } = await setup({
                label: 'Probability',
                value: 0.3,
                valuemin: 0,
                valuemax: 1,
                step: 0.1,
                factor: 100,
            });
            const details: Array<number | null> = [];
            root.addEventListener(
                'change',
                (event: CustomEvent<number | null>) => {
                    details.push(event.detail);
                }
            );

            expect(indicator(root).textContent).toBe('30');

            clearButton(root).click();
            await waitForChanges();

            expect(details).toEqual([null]);
            expect(root.classList.contains('is-unset')).toBe(true);
            // The step-aligned midpoint of 0-100 in steps of 10.
            expect(rangeInput(root).value).toBe('50');
        });

        it('emits again after the slider is cleared and pressed', async () => {
            const { root, waitForChanges } = await setup({
                label: 'Priority',
                value: 5,
                valuemin: 1,
                valuemax: 5,
                step: 1,
            });
            const details: Array<number | null> = [];
            root.addEventListener(
                'change',
                (event: CustomEvent<number | null>) => {
                    details.push(event.detail);
                }
            );

            clearButton(root).click();
            await waitForChanges();
            rangeInput(root).dispatchEvent(new Event('click'));
            await waitForChanges();

            expect(details).toHaveLength(2);
            expect(details[0]).toBeNull();
            expect(details[1]).toBe(3);
            expect(root.classList.contains('is-unset')).toBe(false);
        });
    });
});
