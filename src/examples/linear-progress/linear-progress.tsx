import { Component, State } from '@stencil/core';

const FRACTION = 100;

@Component({
    shadow: true,
    tag: 'limel-example-linear-progress',
})
export class LinearProgressExample {
    @State()
    private value = 0.7;

    constructor() {
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return [
            <limel-input-field
                label="Value"
                value={(this.value * FRACTION).toFixed(0)}
                onChange={this.onChange}
            />,
            <p>
                <limel-linear-progress value={this.value} />
            </p>,
        ];
    }

    private onChange(event) {
        this.value = +event.detail / FRACTION;
    }
}
