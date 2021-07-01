import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-brand-color-palette',
    shadow: true,
    styleUrl: 'lime-color-palette.scss',
})
export class PaletteExample {
    @State()
    private primaryColors: boolean = false;

    constructor() {
        this.toggleMode = this.toggleMode.bind(this);
    }
    public render() {
        return (
            <div class={{ 'highlight-primary-colors': this.primaryColors }}>
                <div class="color-palette">
                    <div class="--lime-brand-color-deep-red swatch hue">
                        --lime-brand-color-deep-red
                    </div>
                    <div class="swatch hue">
                        <span class="equals">=</span>--color-red-light
                        <span class="which-mood">in dark-mode</span>
                    </div>

                    <div class="--lime-brand-color-loving-magenta swatch hue is-primary">
                        --lime-brand-color-loving-magenta
                    </div>
                    <div class="swatch hue">
                        <span class="equals">=</span>--color-magenta-default
                        <span class="which-mood">in dark-mode</span>
                    </div>

                    <div class="--lime-brand-color-simple-blue swatch hue is-primary">
                        --lime-brand-color-simple-blue
                    </div>
                    <div class="swatch hue">
                        <span class="equals">=</span>--color-sky-light
                        <span class="which-mood">in dark-mode</span>
                    </div>

                    <div class="--lime-brand-color-flexible-turquoise swatch hue is-primary">
                        --lime-brand-color-flexible-turquoise
                    </div>
                    <div class="swatch hue">
                        <span class="equals">=</span>--color-teal-light
                        <span class="which-mood">in dark-mode</span>
                    </div>

                    <div class="--lime-brand-color-lime-green swatch hue is-primary">
                        --lime-brand-color-lime-green
                    </div>
                    <div class="swatch hue">
                        <span class="equals">=</span>--color-lime-light
                        <span class="which-mood">in dark-mode</span>
                    </div>

                    <div class="--lime-brand-color-yellow swatch hue">
                        --lime-brand-color-yellow
                    </div>
                    <div class="swatch hue">
                        <span class="equals">=</span>--color-amber-light
                        <span class="which-mood">in dark-mode</span>
                    </div>

                    <div class="--lime-brand-color-orange swatch hue">
                        --lime-brand-color-orange
                    </div>
                    <div class="swatch hue">
                        <span class="equals">=</span>--color-amber-default
                        <span class="which-mood">in dark-mode</span>
                    </div>

                    <div class="--lime-brand-color-sellable-orange swatch hue is-primary">
                        --lime-brand-color-sellable-orange
                    </div>
                    <div class="swatch hue">
                        <span class="equals">=</span>--color-coral-light
                        <span class="which-mood">in dark-mode</span>
                    </div>

                    <div class="--lime-brand-color-light-grey swatch hue">
                        --lime-brand-color-light-grey
                    </div>
                    <div class="swatch hue">
                        <span class="equals">=</span>--color-gray-light
                        <span class="which-mood">in dark-mode</span>
                    </div>

                    <div class="--lime-brand-color-grey swatch hue is-primary">
                        --lime-brand-color-grey
                    </div>
                    <div class="swatch hue">
                        <span class="equals">=</span>--color-gray-dark
                        <span class="which-mood">in light-mode</span>
                    </div>

                    <div class="--lime-brand-color-dark-blue swatch hue">
                        --lime-brand-color-dark-blue
                    </div>
                    <div class="swatch hue">
                        <span class="equals">=</span>--color-glaucous
                        <span class="which-mood">in light-mode</span>
                    </div>
                </div>
                <limel-flex-container justify="start">
                    <limel-checkbox
                        label="Highlight primary brand colors"
                        onChange={this.toggleMode}
                        checked={this.primaryColors}
                    />
                </limel-flex-container>
            </div>
        );
    }

    private toggleMode() {
        this.primaryColors = !this.primaryColors;
    }
}
