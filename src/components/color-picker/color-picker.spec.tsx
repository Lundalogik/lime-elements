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
                <limel-tooltip elementid="tooltip-button"></limel-tooltip>
                    <div class="color-picker">
                        <limel-popover>
                            <div class="picker-trigger" id="tooltip-button" role="button" slot="trigger" tabindex="0"></div>
                            <limel-color-picker-palette label="Hair color">
                                <mock:shadow-root></mock:shadow-root>
                            </limel-color-picker-palette>
                        </limel-popover>
                        <limel-input-field class="chosen-color-input" label="Hair color"></limel-input-field>
                    </div>
            </mock:shadow-root>
        </limel-color-picker>`);
});

test('the component renders all colors in the palette', () => {
    colors.forEach((color) => {
        brightnesses.forEach((brightness) => {
            const swatchElement = getSwatchElement(color, brightness);
            expect(swatchElement).toEqualHtml(`
                <div class="--color-${color}-${brightness} swatch" tabindex="0"></div>
            `);
        });
    });
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
