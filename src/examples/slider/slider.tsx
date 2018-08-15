import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-slider',
    shadow: true,
})
export class SliderExample {
    @State()
    private disabled = false;
    @State()
    private value = 25;

    private maxValue = 75;
    private minValue = 15;

    public render() {
        return [
            <limel-button-group>
                <limel-button
                    onClick={() => {
                        this.disabled = !this.disabled;
                    }}
                    label={this.disabled ? 'Enable' : 'Disable'}
                />
            </limel-button-group>,
            <limel-slider
                label="Slider"
                disabled={this.disabled}
                unit=" %"
                value={this.value}
                valuemax={this.maxValue}
                valuemin={this.minValue}
                onChange={event => {
                    this.value = event.detail;
                }}
            />,
            <p>Current value: {this.value}</p>,
        ];
    }
}
