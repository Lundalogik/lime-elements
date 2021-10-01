import { Component, h, State } from '@stencil/core';

@Component({
    shadow: true,
    tag: 'limel-example-circular-progress',
    styleUrl: 'circular-progress.scss',
})
export class CircularProgressExample {
    @State()
    private value = 65;

    public render() {
        const value = `${this.value}`;

        return [
            <limel-input-field
                label="Value"
                type="number"
                value={value}
                onChange={this.handleChange}
            />,
            <limel-circular-progress value={this.value} />,
        ];
    }

    private handleChange = (event) => {
        this.value = +event.detail;
    };
}
