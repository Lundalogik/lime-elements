import { Component, h, State } from '@stencil/core';

/**
 * Setting the color
 */
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

    constructor() {
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return [
            <limel-select
                label="Color"
                options={this.colors}
                value={this.color}
                onChange={this.onChange}
            />,
            <p>
                <limel-linear-progress
                    value={this.value}
                    style={{
                        '--lime-primary-color': `var(--${this.color.value})`,
                        '--background-color': 'whitesmoke',
                    }}
                />
            </p>,
        ];
    }

    private onChange(event) {
        this.color = event.detail;
    }
}
