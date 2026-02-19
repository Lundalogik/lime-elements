import { render, h } from '@stencil/vitest';
import { brightnesses, colors, getSwatchValue } from './swatches';

describe('limel-color-picker-palette', () => {
    describe('default palette', () => {
        it('renders all color swatches', async () => {
            const { root, waitForChanges } = await render(
                <limel-color-picker-palette label="Colors"></limel-color-picker-palette>
            );
            await waitForChanges();

            const buttons = root.shadowRoot.querySelectorAll('button.swatch');
            expect(buttons.length).toEqual(colors.length * brightnesses.length);
        });

        it('renders each swatch with the correct CSS variable', async () => {
            const { root, waitForChanges } = await render(
                <limel-color-picker-palette label="Colors"></limel-color-picker-palette>
            );
            await waitForChanges();

            const buttons = root.shadowRoot.querySelectorAll(
                'button.swatch'
            ) as NodeListOf<HTMLButtonElement>;
            const allStyles = [...buttons].map((btn) =>
                btn.style
                    .getPropertyValue('--limel-color-picker-swatch-color')
                    .trim()
            );

            for (const color of colors) {
                for (const brightness of brightnesses) {
                    const expectedValue = getSwatchValue(color, brightness);
                    expect(allStyles).toContain(expectedValue);
                }
            }
        });

        it('marks the matching swatch as selected', async () => {
            const value = 'rgb(var(--color-pink-light))';
            const { root, waitForChanges } = await render(
                <limel-color-picker-palette
                    label="Colors"
                    value={value}
                ></limel-color-picker-palette>
            );
            await waitForChanges();

            const buttons = root.shadowRoot.querySelectorAll(
                'button.swatch'
            ) as NodeListOf<HTMLButtonElement>;
            const selectedButtons = [...buttons].filter((btn) =>
                btn.classList.contains('swatch--selected')
            );
            expect(selectedButtons.length).toBe(1);
            expect(
                selectedButtons[0].style
                    .getPropertyValue('--limel-color-picker-swatch-color')
                    .trim()
            ).toEqual(value);
        });

        it('has no selected swatch when value does not match', async () => {
            const { root, waitForChanges } = await render(
                <limel-color-picker-palette
                    label="Colors"
                    value="not-a-color"
                ></limel-color-picker-palette>
            );
            await waitForChanges();

            const selected = root.shadowRoot.querySelectorAll(
                'button.swatch--selected'
            );
            expect(selected.length).toBe(0);
        });

        it('emits change when a swatch is clicked', async () => {
            const handleChange = vi.fn();
            const { root, waitForChanges } = await render(
                <limel-color-picker-palette
                    label="Colors"
                    onChange={handleChange}
                ></limel-color-picker-palette>
            );
            await waitForChanges();

            const buttons = root.shadowRoot.querySelectorAll(
                'button.swatch'
            ) as NodeListOf<HTMLButtonElement>;
            const pinkLight = [...buttons].find(
                (btn) =>
                    btn.style
                        .getPropertyValue('--limel-color-picker-swatch-color')
                        .trim() === 'rgb(var(--color-pink-light))'
            );
            expect(pinkLight).toBeTruthy();
            pinkLight.click();
            await waitForChanges();

            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange.mock.calls[0][0].detail).toEqual(
                'rgb(var(--color-pink-light))'
            );
        });

        it('deselects when clicking an already-selected swatch', async () => {
            const handleChange = vi.fn();
            const value = 'rgb(var(--color-pink-light))';
            const { root, waitForChanges } = await render(
                <limel-color-picker-palette
                    label="Colors"
                    value={value}
                    onChange={handleChange}
                ></limel-color-picker-palette>
            );
            await waitForChanges();

            const selected = root.shadowRoot.querySelector(
                'button.swatch--selected'
            ) as HTMLButtonElement;
            selected.click();
            await waitForChanges();

            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange.mock.calls[0][0].detail).toEqual('');
        });

        it('updates selection when value prop changes', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-color-picker-palette
                    label="Colors"
                    value="rgb(var(--color-pink-light))"
                ></limel-color-picker-palette>
            );
            await waitForChanges();

            let selected = root.shadowRoot.querySelectorAll(
                'button.swatch--selected'
            );
            expect(selected.length).toBe(1);

            setProps({ value: 'rgb(var(--color-teal-dark))' });
            await waitForChanges();

            selected = root.shadowRoot.querySelectorAll(
                'button.swatch--selected'
            );
            expect(selected.length).toBe(1);
            expect(
                (selected[0] as HTMLButtonElement).style
                    .getPropertyValue('--limel-color-picker-swatch-color')
                    .trim()
            ).toEqual('rgb(var(--color-teal-dark))');
        });
    });

    describe('custom palette', () => {
        const customPalette = [
            { name: 'Primary', value: '#112233' },
            '#abcdef',
            { name: 'Disabled', value: 'rebeccapurple', disabled: true },
        ];

        it('renders only the provided custom swatches', async () => {
            const { root, waitForChanges } = await render(
                <limel-color-picker-palette
                    label="Custom"
                    palette={customPalette}
                ></limel-color-picker-palette>
            );
            await waitForChanges();

            const buttons = root.shadowRoot.querySelectorAll(
                'button.custom-swatch'
            );
            expect(buttons.length).toBe(3);
        });

        it('does not render default swatches', async () => {
            const { root, waitForChanges } = await render(
                <limel-color-picker-palette
                    label="Custom"
                    palette={customPalette}
                ></limel-color-picker-palette>
            );
            await waitForChanges();

            const defaultSwatches = root.shadowRoot.querySelectorAll(
                'button.swatch:not(.custom-swatch)'
            );
            expect(defaultSwatches.length).toBe(0);
        });

        it('emits the raw color value when clicked', async () => {
            const handleChange = vi.fn();
            const { root, waitForChanges } = await render(
                <limel-color-picker-palette
                    label="Custom"
                    palette={customPalette}
                    onChange={handleChange}
                ></limel-color-picker-palette>
            );
            await waitForChanges();

            const buttons = root.shadowRoot.querySelectorAll(
                'button.custom-swatch'
            ) as NodeListOf<HTMLButtonElement>;
            buttons[1].click();
            await waitForChanges();

            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange.mock.calls[0][0].detail).toEqual('#abcdef');
        });

        it('disables swatches with disabled flag', async () => {
            const { root, waitForChanges } = await render(
                <limel-color-picker-palette
                    label="Custom"
                    palette={customPalette}
                ></limel-color-picker-palette>
            );
            await waitForChanges();

            const buttons = root.shadowRoot.querySelectorAll(
                'button.custom-swatch'
            ) as NodeListOf<HTMLButtonElement>;
            expect(buttons[2].hasAttribute('disabled')).toBe(true);
            expect(buttons[0].hasAttribute('disabled')).toBe(false);
        });

        it('selects the matching custom swatch', async () => {
            const { root, waitForChanges } = await render(
                <limel-color-picker-palette
                    label="Custom"
                    palette={customPalette}
                    value="#abcdef"
                ></limel-color-picker-palette>
            );
            await waitForChanges();

            const selected = root.shadowRoot.querySelectorAll(
                'button.swatch--selected'
            );
            expect(selected.length).toBe(1);
        });
    });

    describe('manual input', () => {
        it('renders an input field inside the palette', async () => {
            const { root, waitForChanges } = await render(
                <limel-color-picker-palette label="Colors"></limel-color-picker-palette>
            );
            await waitForChanges();

            const input = root.shadowRoot.querySelector('limel-input-field');
            expect(input).toBeTruthy();
        });

        it('renders color preview element', async () => {
            const { root, waitForChanges } = await render(
                <limel-color-picker-palette
                    label="Colors"
                    value="#ff0000"
                ></limel-color-picker-palette>
            );
            await waitForChanges();

            const preview = root.shadowRoot.querySelector(
                '.chosen-color-preview'
            );
            expect(preview).toBeTruthy();
        });
    });
});
