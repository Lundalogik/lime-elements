import { render, h } from '@stencil/vitest';
import { brightnesses, colors } from './swatches';

/**
 * Open the color-picker's popover by clicking the trigger button,
 * then find the palette in the portal on document.body.
 *
 * Portal path:
 *   document.body > .limel-portal--container > limel-popover-surface (shadow) > palette
 * @param root
 * @param waitForChanges
 */
async function openAndFindPalette(
    root: HTMLElement,
    waitForChanges: () => Promise<void>
): Promise<HTMLElement> {
    const trigger = root.shadowRoot!.querySelector('button[slot="trigger"]');
    (trigger as HTMLElement).click();

    for (let i = 0; i < 10; i++) {
        await waitForChanges();

        const containers = document.querySelectorAll(
            '.limel-portal--container'
        );
        for (const container of containers) {
            const surface = container.querySelector('limel-popover-surface');
            if (surface?.shadowRoot) {
                const palette = surface.shadowRoot.querySelector(
                    'limel-color-picker-palette'
                );
                if (palette?.shadowRoot) {
                    return palette;
                }
            }
        }
    }

    return null;
}

describe('limel-color-picker', () => {
    describe('rendering', () => {
        it('renders a trigger button', async () => {
            const { root, waitForChanges } = await render(
                <limel-color-picker label="Hair color"></limel-color-picker>
            );
            await waitForChanges();

            const button = root.shadowRoot!.querySelector(
                'button[slot="trigger"]'
            );
            expect(button).toBeTruthy();
        });

        it('renders an input field with the label', async () => {
            const { root, waitForChanges } = await render(
                <limel-color-picker label="Hair color"></limel-color-picker>
            );
            await waitForChanges();

            const input = root.shadowRoot!.querySelector('limel-input-field');
            expect(input).toBeTruthy();
            expect(input.getAttribute('label')).toEqual('Hair color');
        });

        it('renders a popover', async () => {
            const { root, waitForChanges } = await render(
                <limel-color-picker label="Hair color"></limel-color-picker>
            );
            await waitForChanges();

            const popover = root.shadowRoot!.querySelector('limel-popover');
            expect(popover).toBeTruthy();
        });
    });

    describe('opening the palette', () => {
        it('renders all default swatches in the palette', async () => {
            const { root, waitForChanges } = await render(
                <limel-color-picker label="Hair color"></limel-color-picker>
            );
            await waitForChanges();

            const palette = await openAndFindPalette(root, waitForChanges);
            expect(palette).toBeTruthy();

            const buttons =
                palette.shadowRoot.querySelectorAll('button.swatch');
            expect(buttons.length).toEqual(colors.length * brightnesses.length);
        });
    });

    describe('selecting a color', () => {
        it('emits change when a swatch is clicked', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-color-picker label="Hair color"></limel-color-picker>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            const palette = await openAndFindPalette(root, waitForChanges);
            expect(palette).toBeTruthy();

            const buttons = palette.shadowRoot.querySelectorAll(
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

            expect(changeSpy).toHaveReceivedEventTimes(1);
            expect(changeSpy).toHaveReceivedEventDetail(
                'rgb(var(--color-pink-light))'
            );
        });

        it('shows selected swatch when value is set', async () => {
            const value = 'rgb(var(--color-pink-light))';
            const { root, waitForChanges } = await render(
                <limel-color-picker
                    label="Hair color"
                    value={value}
                ></limel-color-picker>
            );
            await waitForChanges();

            const palette = await openAndFindPalette(root, waitForChanges);
            expect(palette).toBeTruthy();

            const selected = palette.shadowRoot.querySelectorAll(
                'button.swatch--selected'
            );
            expect(selected.length).toBe(1);
        });
    });

    describe('disabled state', () => {
        it('disables the trigger button', async () => {
            const { root, waitForChanges } = await render(
                <limel-color-picker
                    label="Color"
                    disabled={true}
                ></limel-color-picker>
            );
            await waitForChanges();

            const button = root.shadowRoot!.querySelector(
                'button[slot="trigger"]'
            );
            expect(button.hasAttribute('disabled')).toBe(true);
        });
    });

    describe('readonly state', () => {
        it('renders trigger without popover', async () => {
            const { root, waitForChanges } = await render(
                <limel-color-picker
                    label="Color"
                    readonly={true}
                ></limel-color-picker>
            );
            await waitForChanges();

            const popover = root.shadowRoot!.querySelector('limel-popover');
            expect(popover).toBeNull();

            const button = root.shadowRoot!.querySelector(
                'button[slot="trigger"]'
            );
            expect(button).toBeTruthy();
            expect(button.hasAttribute('disabled')).toBe(true);
        });
    });

    describe('with custom palette', () => {
        const customPalette = [
            { name: 'Primary', value: '#112233' },
            '#abcdef',
            { name: 'Disabled', value: 'rebeccapurple', disabled: true },
        ];

        it('renders custom swatches in the palette', async () => {
            const { root, waitForChanges } = await render(
                <limel-color-picker
                    label="Custom"
                    palette={customPalette}
                ></limel-color-picker>
            );
            await waitForChanges();

            const palette = await openAndFindPalette(root, waitForChanges);
            expect(palette).toBeTruthy();

            const buttons = palette.shadowRoot.querySelectorAll(
                'button.custom-swatch'
            );
            expect(buttons.length).toBe(3);

            const defaultSwatches = palette.shadowRoot.querySelectorAll(
                'button.swatch:not(.custom-swatch)'
            );
            expect(defaultSwatches.length).toBe(0);
        });

        it('emits raw color value on custom swatch click', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-color-picker
                    label="Custom"
                    palette={customPalette}
                ></limel-color-picker>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            const palette = await openAndFindPalette(root, waitForChanges);
            expect(palette).toBeTruthy();

            const buttons = palette.shadowRoot.querySelectorAll(
                'button.custom-swatch'
            ) as NodeListOf<HTMLButtonElement>;

            expect(buttons[2].hasAttribute('disabled')).toBe(true);
            expect(buttons[0].hasAttribute('disabled')).toBe(false);

            buttons[1].click();
            await waitForChanges();

            expect(changeSpy).toHaveReceivedEventTimes(1);
            expect(changeSpy).toHaveReceivedEventDetail('#abcdef');
        });
    });
});
