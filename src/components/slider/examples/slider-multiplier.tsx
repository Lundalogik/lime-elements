import { Component, h, State } from '@stencil/core';

/**
 * With multiplier and step
 *
 * Sometimes the actual data values are small or fractional (e.g. `0` to `1`),
 * but you want to present them in a more human-friendly way.
 * The `factor` prop scales the display: a factor of `100` turns `0–1` into `0–100`,
 * so the user sees and interacts with percentages,
 * while the emitted `change` value stays in the original `0–1` range.
 *
 * The `step` prop constrains the slider to discrete snap points.
 * Here, `step` is `0.1`, meaning the actual values are `0`, `0.1`, `0.2`, …, `1.0`.
 * With a `factor` of `100`, those display as `0`, `10`, `20`, …, `100`.
 *
 * If the initial value is not aligned to a step,
 * the slider rounds it to the nearest valid step on the first interaction.
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
    private step = 0.1;

    public render() {
        return (
            <section>
                <limel-slider
                    label="Slider with multiplier"
                    unit=" %"
                    value={this.value}
                    factor={this.factor}
                    step={this.step}
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
