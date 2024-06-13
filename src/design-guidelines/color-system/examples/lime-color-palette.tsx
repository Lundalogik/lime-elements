import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-brand-color-palette',
    shadow: true,
    styleUrl: 'lime-color-palette.scss',
})
export class PaletteExample {
    public render() {
        return (
            <div>
                <div class="color-palette">
                    <div class="--lime-brand-color-lime-green swatch hue">
                        --lime-brand-color-lime-green
                    </div>
                    <div class="swatch hue">
                        <span class="equals">=</span>rgb(190, 224, 52) / #BEE034
                    </div>
                    <div class="--lime-brand-color-ocean-teal swatch hue">
                        --lime-brand-color-ocean-teal
                    </div>
                    <div class="swatch hue">
                        <span class="equals">=</span>rgb(111, 205, 182) /
                        #6FCDB6
                    </div>
                    <div class="--lime-brand-color-aqua swatch hue">
                        --lime-brand-color-aqua
                    </div>
                    <div class="swatch hue">
                        <span class="equals">=</span>rgb(166, 239, 255) /
                        #A6EFFF
                    </div>
                    <div class="--lime-brand-color-bubble-gum swatch hue">
                        --lime-brand-color-bubble-gum
                    </div>
                    <div class="swatch hue">
                        <span class="equals">=</span>rgb(255, 166, 234) /
                        #FFA6EA
                    </div>
                    <div class="--lime-brand-color-sunny-orange swatch hue">
                        --lime-brand-color-sunny-orange
                    </div>
                    <div class="swatch hue">
                        <span class="equals">=</span>rgb(254, 176, 0) / #FEB000
                    </div>
                    <div class="--lime-brand-color-cool-grey swatch hue">
                        --lime-brand-color-cool-grey
                    </div>
                    <div class="swatch hue">
                        <span class="equals">=</span>rgb(84, 87, 98) / #545762
                    </div>
                </div>
            </div>
        );
    }
}
