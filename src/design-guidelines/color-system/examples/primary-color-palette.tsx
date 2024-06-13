import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-primary-color-palette',
    shadow: true,
    styleUrl: 'primary-color-palette.scss',
})
export class PaletteExample {
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
            <div>
                <div class="color-palette">
                    {this.renderSwatches()}
                    <div class="brightness-label">light</div>
                    <div class="brightness-label">default</div>
                </div>
            </div>
        );
    }

    private renderSwatches = (): JSX.Element[][] => {
        return this.colors.map((color) => {
            return [
                <div class={`swatch --color-${color}-light`}></div>,
                <div class={`swatch --color-${color}-default`}>·</div>,
                <div class="swatch hue">{color}</div>,
            ];
        });
    };
}
