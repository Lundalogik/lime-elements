import { Component, State } from '@stencil/core';

const FRACTION = 100;

@Component({
    shadow: true,
    tag: 'limel-example-linear-progress',
})
export class LinearProgressExample {
    @State()
    private value = 0.7;

    @State()
    private color = { text: 'cornflowerblue', value: 'cornflowerblue' };

    private fixedValueForColorExample = 0.85;

    private colors = [
        { text: 'firebrick', value: 'firebrick' },
        { text: 'chocolate', value: 'chocolate' },
        { text: 'goldenrod', value: 'goldenrod' },
        { text: 'seagreen', value: 'seagreen' },
        { text: 'cornflowerblue', value: 'cornflowerblue' },
        { text: 'rebeccapurple', value: 'rebeccapurple' },
    ];

    public render() {
        return [
            <section>
                <h3>Basic Usage</h3>
                <p>
                    <limel-text-field
                        label="Value"
                        value={(this.value * FRACTION).toFixed(0)}
                        onChange={event => {
                            this.value = +event.detail / FRACTION;
                        }}
                    />
                </p>
                <p>
                    <limel-linear-progress value={this.value} />
                </p>
            </section>,
            <section>
                <h3>Setting the Color</h3>
                <p>
                    <limel-select
                        label="Color"
                        options={this.colors}
                        value={this.color}
                        onChange={event => {
                            this.color = event.detail;
                        }}
                    />
                </p>
                <p>
                    <limel-linear-progress
                        value={this.fixedValueForColorExample}
                        style={{
                            '--mdc-theme-primary': this.color.value,
                        }}
                    />
                </p>
            </section>,
        ];
    }
}
