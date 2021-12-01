import { Component, h, State } from '@stencil/core';

/**
 * With multiplier and step
 *
 * When step is configured and the initial value is not a multiple of the step
 * value, the slider will round the value to the nearest step when it is changed
 * for the first time. After a valid value has been set, only discrete valid
 * values will be possible to pick.
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
