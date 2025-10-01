import { h } from '@stencil/core';
import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { ColorPicker } from './color-picker';
import { Palette } from './color-picker-palette';
import { brightnesses, colors } from './swatches';

let page: SpecPage;
let handleChange: jest.Mock;

beforeEach(async () => {
    handleChange = jest.fn();
    page = await newSpecPage({
        components: [ColorPicker, Palette],
        template: () => (
            <limel-color-picker label="Hair color" onChange={handleChange} />
        ),
    });

    await page.waitForChanges();
});

test('the component renders', () => {
    const palette = getPaletteElement();
    palette.shadowRoot.innerHTML = '';

    expect(page.body).toEqualHtml(`
        <limel-color-picker label="Hair color">
            <mock:shadow-root>
                <limel-popover opendirection="bottom-start">
                    <button id="tooltip-button" role="button" slot="trigger"></button>
                    <limel-color-picker-palette label="Hair color">
                        <mock:shadow-root></mock:shadow-root>
                    </limel-color-picker-palette>
                </limel-popover>
                <limel-input-field label="Hair color"></limel-input-field>
            </mock:shadow-root>
        </limel-color-picker>`);
});

test('the component renders all colors in the palette', () => {
    for (const color of colors) {
        for (const brightness of brightnesses) {
            const swatchElement = getSwatchElement(color, brightness);
            expect(swatchElement).not.toBeNull();
            expect(swatchElement).toHaveClass('swatch');
            const expectedStyle = `--limel-color-picker-swatch-color: rgb(var(--color-${color}-${brightness}))`;
            expect(swatchElement.getAttribute('style')).toContain(
                expectedStyle
            );
        }
    }
});

test('a new value is emitted when a swatch is clicked', async () => {
    const swatchElement = getSwatchElement('pink', 'light');
    swatchElement.click();

    await page.waitForChanges();

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
            detail: 'rgb(var(--color-pink-light))',
        })
    );
});

test('swatch is set to selected when a value is set', async () => {
    const picker = getPickerElement();
    picker.value = 'rgb(var(--color-pink-light))';

    await page.waitForChanges();

    let swatchElement = getSwatchElement('pink', 'light');
    expect(swatchElement).toHaveClass('swatch--selected');

    swatchElement = getSwatchElement('teal', 'dark');
    expect(swatchElement).not.toHaveClass('swatch--selected');
});

describe('with a custom palette', () => {
    let customPage: SpecPage;
    let customHandleChange: jest.Mock;
    const customPalette = [
        { name: 'Primary', value: '#112233' },
        '#abcdef',
        { name: 'Disabled', value: 'rebeccapurple', disabled: true },
    ];

    beforeEach(async () => {
        customHandleChange = jest.fn();
        customPage = await newSpecPage({
            components: [ColorPicker, Palette],
            template: () => (
                <limel-color-picker
                    label="Custom"
                    palette={customPalette}
                    onChange={customHandleChange}
                />
            ),
        });
        await customPage.waitForChanges();
    });

    test('renders only the provided custom swatches', () => {
        const palette = customPage.body
            .querySelector('limel-color-picker')
            .shadowRoot.querySelector('limel-color-picker-palette').shadowRoot;
        const buttons = palette.querySelectorAll('button.custom-swatch');
        expect(buttons.length).toBe(customPalette.length);
    });

    test('emits raw color value when a custom swatch is clicked', async () => {
        const palette = customPage.body
            .querySelector('limel-color-picker')
            .shadowRoot.querySelector('limel-color-picker-palette').shadowRoot;
        const secondButton = palette.querySelectorAll(
            'button.custom-swatch'
        )[1] as HTMLButtonElement;
        secondButton.click();
        await customPage.waitForChanges();
        expect(customHandleChange).toHaveBeenCalledWith(
            expect.objectContaining({ detail: '#abcdef' })
        );
    });
});

// Helpers
function getPickerElement(): HTMLLimelColorPickerElement {
    return page.body.querySelector('limel-color-picker');
}

function getPaletteElement(): HTMLLimelColorPickerPaletteElement {
    return getPickerElement().shadowRoot.querySelector(
        'limel-color-picker-palette'
    );
}

function getSwatchElement(
    color: string,
    brightness: string
): HTMLButtonElement {
    const expectedValue = `rgb(var(--color-${color}-${brightness}))`;
    const buttons = [
        ...getPaletteElement().shadowRoot.querySelectorAll('button.swatch'),
    ] as HTMLButtonElement[];
    return buttons.find(
        (btn) =>
            btn.style
                .getPropertyValue('--limel-color-picker-swatch-color')
                .trim() === expectedValue
    );
}
