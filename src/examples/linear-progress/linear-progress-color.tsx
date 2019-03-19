import { Component, State } from '@stencil/core';

@Component({
    shadow: true,
    tag: 'limel-example-linear-progress-color',
})
export class LinearProgressExampleColor {
    @State()
    private color = { text: 'lime-blue', value: 'lime-blue' };

    private value = 0.85;

    private colors = [
        { text: 'lime-red', value: 'lime-red' },
        { text: 'lime-orange', value: 'lime-orange' },
        { text: 'lime-yellow', value: 'lime-yellow' },
        { text: 'lime-green', value: 'lime-green' },
        { text: 'lime-blue', value: 'lime-blue' },
        { text: 'lime-magenta', value: 'lime-magenta' },
    ];

    public render() {
        return [
            <limel-select
                label="Color"
                options={this.colors}
                value={this.color}
                onChange={event => {
                    this.color = event.detail;
                }}
            />,
            <br />,
            <br />,
            <limel-linear-progress
                value={this.value}
                style={{
                    '--lime-primary-color': `var(--${this.color.value})`,
                    '--background-color': 'whitesmoke',
                }}
            />,
        ];
    }
}
