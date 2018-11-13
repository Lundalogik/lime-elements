import { Component, State } from '@stencil/core';

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
                value={(this.value * FRACTION).toFixed(0)}
                onChange={event => {
                    this.value = +event.detail / FRACTION;
                }}
            />,
            <br />,
            <limel-linear-progress value={this.value} />,
        ];
    }
}
