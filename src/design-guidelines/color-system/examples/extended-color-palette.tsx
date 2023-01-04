import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-extended-color-palette',
    shadow: true,
    styleUrl: 'extended-color-palette.scss',
})
export class PaletteExample {
    @State()
    private brandColors: boolean = false;

    private colors = [
        'red',
        'pink',
        'magenta',
        'purple',
        'violet',
        'indigo',
        'blue',
        'sky',
        'cyan',
        'teal',
        'green',
        'lime',
        'grass',
        'yellow',
        'amber',
        'orange',
        'coral',
        'brown',
        'gray',
        'glaucous',
    ];

    public render() {
        return (
            <div class={{ 'brand-colors': this.brandColors }}>
                <div class="color-palette">
                    {this.renderSwatches()}
                    <div class="brightness-label">lighter</div>
                    <div class="brightness-label">light</div>
                    <div class="brightness-label">default</div>
                    <div class="brightness-label">dark</div>
                    <div class="brightness-label">darker</div>
                </div>
                <limel-checkbox
                    label="Highlight Lime's brand colors"
                    onChange={this.toggleMode}
                    checked={this.brandColors}
                />
                <div class="brand-colors-tips">
                    Most of the brand colors are included in the subset for "
                    <b>dark mode</b>". Switch between dark & light mode to see
                    all of them.
                </div>
            </div>
        );
    }

    private renderSwatches = (): JSX.Element[][] => {
        return this.colors.map((color) => {
            return [
                <div class={`swatch --color-${color}-lighter`}></div>,
                <div class={`swatch --color-${color}-light`}></div>,
                <div class={`swatch --color-${color}-default`}>·</div>,
                <div class={`swatch --color-${color}-dark`}></div>,
                <div class={`swatch --color-${color}-darker`}></div>,
                <div class="swatch hue">{color}</div>,
            ];
        });
    };

    private toggleMode = () => {
        this.brandColors = !this.brandColors;
    };
}
