import { Component, h, State } from '@stencil/core';
/**
 * Displaying percentage colors
 * At Lime Technologies we have a convention for displaying percentage colors.
 * The colors we use to display a range change with intervals of 10.
 * The color spectrum is not modifiable, and looks like
 * red → orange → yellow → green → teal.
 * To enable this feature, simply set `displayPercentageColors` to `true`.
 *
 * Try changing the value in the example below to see how colors change
 * for different percentages.
 */
@Component({
    shadow: true,
    tag: 'limel-example-circular-progress-percentage-colors',
    styleUrl: 'circular-progress.scss',
})
export class CircularProgressPercentageColorsExample {
    @State()
    private value = 5;

    public render() {
        const value = `${this.value}`;

        return [
            <limel-input-field
                label="Value"
                type="number"
                value={value}
                onChange={this.handleChange}
            />,
            <limel-circular-progress
                value={this.value}
                displayPercentageColors={true}
            />,
        ];
    }

    private handleChange = (event) => {
        this.value = +event.detail;
    };
}
