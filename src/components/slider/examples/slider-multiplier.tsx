import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-slider-multiplier',
    shadow: true,
    styleUrl: 'slider.scss',
})
export class SliderMultiplierExample {
    @State()
    private value = 0.25;

    private factor = 100;
    private minValue = 0;
    private maxValue = 1;

    constructor() {
        this.onChange = this.onChange.bind(this);
    }

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
                    onChange={this.onChange}
                />
                <p>Current value: {this.value}</p>
            </section>
        );
    }

    private onChange(event) {
        this.value = event.detail;
    }
}
