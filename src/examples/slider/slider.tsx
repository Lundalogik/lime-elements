import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-slider',
    shadow: true,
    styleUrl: 'slider.scss',
})
export class SliderExample {
    @State()
    private disabled = false;

    @State()
    private value = 25;

    private minValue = 15;
    private maxValue = 75;

    constructor() {
        this.onChange = this.onChange.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
    }

    public render() {
        return (
            <section>
                <limel-slider
                    label="Basic slider"
                    unit=" %"
                    value={this.value}
                    valuemax={this.maxValue}
                    valuemin={this.minValue}
                    disabled={this.disabled}
                    onChange={this.onChange}
                />
                <limel-flex-container justify="end">
                    <limel-button
                        onClick={this.toggleEnabled}
                        label={this.disabled ? 'Enable' : 'Disable'}
                    />
                </limel-flex-container>
                <p>Current value: {this.value}</p>
            </section>
        );
    }

    private onChange(event) {
        this.value = event.detail;
    }

    private toggleEnabled() {
        this.disabled = !this.disabled;
    }
}
