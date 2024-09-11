import { Component, h, State } from '@stencil/core';

const FRACTION = 100;

/**
 * Basic example
 * The component accepts a value between `0` and `1` and visualizes it on a scale.
 * In this example, value `0` stands for `0%` and `1` is `100%`,
 * and the `value` of the linear progress is controlled by an input field.
 */
@Component({
    shadow: true,
    tag: 'limel-example-linear-progress',
})
export class LinearProgressExample {
    @State()
    private value = 0.7;

    public render() {
        return [
            <limel-input-field
                label="Value"
                type="number"
                min={0}
                max={100}
                suffix="%"
                value={(this.value * FRACTION).toFixed(0)}
                onChange={this.handleChange}
            />,
            <p>
                <limel-linear-progress value={this.value} />
            </p>,
        ];
    }

    private handleChange = (event) => {
        this.value = +event.detail / FRACTION;
    };
}
