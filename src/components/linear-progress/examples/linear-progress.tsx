import { Component, h, State } from '@stencil/core';

const FRACTION = 100;

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
