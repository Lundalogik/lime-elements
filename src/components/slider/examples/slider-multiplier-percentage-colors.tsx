import { Component, h, State } from '@stencil/core';

/**
 * With percentage colors
 * You can add the `displays-percentage-colors` class to your slider component
 * and it will automatically visualize current percentage colors in real-time.
 *
 * The colors change with intervals of 10 as users drags the slider pin.
 * The color spectrum is not modifiable, and looks like red → orange → yellow
 * → green → teal.
 */
@Component({
    tag: 'limel-example-slider-multiplier-percentage-colors',
    shadow: true,
})
export class SliderMultiplierPercentageColorsExample {
    @State()
    private disabled = false;

    @State()
    private readonly = false;

    @State()
    private value = 0.25;

    private factor = 100;
    private minValue = 0;
    private maxValue = 1;

    public render() {
        return (
            <section>
                <limel-slider
                    class="displays-percentage-colors"
                    label="Slider with multiplier"
                    unit=" %"
                    value={this.value}
                    factor={this.factor}
                    valuemax={this.maxValue}
                    valuemin={this.minValue}
                    disabled={this.disabled}
                    readonly={this.readonly}
                    onChange={this.changeHandler}
                />
                <limel-flex-container justify="end">
                    <limel-checkbox
                        checked={this.disabled}
                        label="Disabled"
                        onChange={this.setDisabled}
                    />
                    <limel-checkbox
                        checked={this.readonly}
                        label="Readonly"
                        onChange={this.setReadonly}
                    />
                </limel-flex-container>
                <limel-example-value value={this.value} />
            </section>
        );
    }

    private changeHandler = (event: CustomEvent<number>) => {
        this.value = event.detail;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };
}
