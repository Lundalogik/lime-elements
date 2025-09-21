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

    const colorPicker = page.body.querySelector('limel-color-picker');

    // Check the basic structure instead of exact HTML formatting
    expect(colorPicker).toBeTruthy();
    expect(colorPicker.getAttribute('label')).toBe('Hair color');

    // Check shadow root structure
    const shadowRoot = colorPicker.shadowRoot;
    expect(shadowRoot).toBeTruthy();

    // Should have main container
    const container = shadowRoot.querySelector('.color-picker');
    expect(container).toBeTruthy();

    // Should have popover with correct direction
    const popover = shadowRoot.querySelector('limel-popover');
    expect(popover).toBeTruthy();
    expect(popover.getAttribute('opendirection')).toBe('bottom-start');

    // Should have picker trigger button
    const pickerTrigger = shadowRoot.querySelector('button.picker-trigger');
    expect(pickerTrigger).toBeTruthy();
    expect(pickerTrigger.getAttribute('slot')).toBe('trigger');

    // Should have color picker palette
    const colorPalette = shadowRoot.querySelector('limel-color-picker-palette');
    expect(colorPalette).toBeTruthy();
    expect(colorPalette.getAttribute('label')).toBe('Hair color');

    // Should have input field
    const inputField = shadowRoot.querySelector('limel-input-field');
    expect(inputField).toBeTruthy();
    expect(inputField.classList.contains('chosen-color-input')).toBe(true);
    expect(inputField.getAttribute('label')).toBe('Hair color');
});

test('the component renders all colors in the palette', () => {
    for (const color of colors) {
        for (const brightness of brightnesses) {
            const swatchElement = getSwatchElement(color, brightness);
            expect(swatchElement).toEqualHtml(`
                <button class="--color-${color}-${brightness} swatch"></button>
            `);
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

function getPickerElement(): HTMLLimelColorPickerElement {
    return page.body.querySelector('limel-color-picker');
}

function getPaletteElement(): HTMLLimelColorPickerPaletteElement {
    return getPickerElement().shadowRoot.querySelector(
        'limel-color-picker-palette'
    );
}

function getSwatchElement(color: string, brightness: string): HTMLDivElement {
    return getPaletteElement().shadowRoot.querySelector(
        `.--color-${color}-${brightness}`
    );
}
