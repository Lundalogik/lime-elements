import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-slider',
    shadow: true,
})
export class SliderExample {
    @State()
    private disabled = true;

    @State()
    private basicExampleValue = 25;

    private basicExampleMinValue = 15;
    private basicExampleMaxValue = 75;

    @State()
    private factorExampleValue = 0.25;

    private factor = 100;
    private factorExampleMinValue = 0;
    private factorExampleMaxValue = 1;

    @State()
    private disableExampleValue = 35;

    private disableExampleMinValue = 0;
    private disableExampleMaxValue = 100;

    public render() {
        return [
            <section>
                <h3>Basic Usage</h3>
                <limel-slider
                    label="Basic slider"
                    unit=" %"
                    value={this.basicExampleValue}
                    valuemax={this.basicExampleMaxValue}
                    valuemin={this.basicExampleMinValue}
                    onChange={event => {
                        this.basicExampleValue = event.detail;
                    }}
                />
                <p>Current value: {this.basicExampleValue}</p>
            </section>,
            <section>
                <h3>With multiplier factor</h3>
                <limel-slider
                    label="Slider with multiplier"
                    unit=" %"
                    value={this.factorExampleValue}
                    factor={this.factor}
                    valuemax={this.factorExampleMaxValue}
                    valuemin={this.factorExampleMinValue}
                    onChange={event => {
                        this.factorExampleValue = event.detail;
                    }}
                />
                <p>Current value: {this.factorExampleValue}</p>
            </section>,
            <section>
                <h3>Disabled</h3>
                <limel-button-group>
                    <limel-button
                        onClick={() => {
                            this.disabled = !this.disabled;
                        }}
                        label={this.disabled ? 'Enable' : 'Disable'}
                    />
                </limel-button-group>
                <limel-slider
                    label="Can be disabled"
                    disabled={this.disabled}
                    unit=" %"
                    value={this.disableExampleValue}
                    valuemax={this.disableExampleMaxValue}
                    valuemin={this.disableExampleMinValue}
                    onChange={event => {
                        this.disableExampleValue = event.detail;
                    }}
                />
                <p>Current value: {this.disableExampleValue}</p>
            </section>,
        ];
    }
}
