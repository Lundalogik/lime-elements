import { Component, h, State } from '@stencil/core';

/**
 * With Multiplier
 */
@Component({
    tag: 'limel-example-slider-multiplier',
    shadow: true,
})
export class SliderMultiplierExample {
    @State()
    private value = 0.25;

    private factor = 100;
    private minValue = 0;
    private maxValue = 1;

    public render() {
        return (
            <section>
                <limel-slider
                    label="Slider with multiplier"
                    unit=" %"
                    value={this.value}
                    factor={this.factor}
                    valuemax={this.maxValue}
                    valuemin={this.minValue}
                    onChange={this.handleChange}
                />
                <limel-example-value value={this.value} />
            </section>
        );
    }

    private handleChange = (event: CustomEvent<number>) => {
        this.value = event.detail;
    };
}
