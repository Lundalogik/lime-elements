import { Component, h, Host, State } from '@stencil/core';

/**
 * Custom palette example
 * You can easily provide your own array of colors, to be rendered
 * as a palette of swatches. To improve accessibility, we recommend that you
 * also provide a name for each color, which will be used as tooltip
 * and screen reader text.
 *
 * :::note
 * The number of provided colors will determine the number of columns
 * in the palette.
 *
 * However, if the provided array includes many colors,
 * the grid will render at the maximum only 25 columns to avoid
 * unusable UI.
 *
 * If you want to control the number of columns, you can
 * use the `paletteColumnCount` prop.
 * :::
 */
@Component({
    tag: 'limel-example-color-picker-custom-palette',
    shadow: true,
})
export class ColorPickerCustomPaletteExample {
    @State()
    private value: string;

    @State()
    private paletteColumnCount: number;

    private customPalette = [
        { name: 'Brand Primary', value: '#0055ff' },
        { name: 'Brand Secondary', value: '#ff0099' },
        '#ffbf00',
        'rebeccapurple',
        { name: 'Deprecated Green', value: 'hsl(150 60% 45%)', disabled: true },
        { name: 'Soft Gray', value: 'rgb(120 130 140 / 60%)' },
    ];

    public render() {
        return (
            <Host>
                <limel-color-picker
                    value={this.value}
                    palette={this.customPalette}
                    tooltipLabel="Click to pick a custom palette color"
                    label="Brand color"
                    onChange={this.onChange}
                    paletteColumnCount={this.paletteColumnCount}
                />
                <limel-example-controls>
                    <limel-checkbox
                        checked={this.paletteColumnCount === 3}
                        label="Set `paletteColumnCount` to 3"
                        onChange={this.setPaletteColumnCount}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private onChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };

    private setPaletteColumnCount = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.paletteColumnCount = event.detail ? 3 : undefined;
    };
}
