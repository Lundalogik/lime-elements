import { Component, h, Host, State } from '@stencil/core';

/**
 * Using the `unit` prop
 *
 * The `unit` prop lets you display a measurement unit alongside the
 * slider's min, max, and current value indicators. This gives users
 * immediate context about what the number represents, without needing
 * to read surrounding labels or descriptions.
 *
 * For example, a slider controlling temperature becomes much clearer
 * when the value reads `22°C` instead of just `22`.
 */
@Component({
    tag: 'limel-example-slider-unit',
    shadow: true,
})
export class SliderUnitExample {
    @State()
    private value = 22;

    public render() {
        return (
            <Host>
                <limel-slider
                    label="Room temperature"
                    unit="°C"
                    value={this.value}
                    valuemin={16}
                    valuemax={30}
                    step={1}
                    onChange={this.handleChange}
                />
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    private handleChange = (event: CustomEvent<number>) => {
        this.value = event.detail;
    };
}
