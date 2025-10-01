import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-whats-new-example-slider',
    shadow: true,
})
export class WhatsNewSliderExample {
    @State()
    private required = false;

    @State()
    private invalid = false;

    @State()
    private value = 25;

    private minValue = 15;
    private maxValue = 75;

    public render() {
        return [
            <limel-slider
                label="Basic slider"
                unit=" %"
                value={this.value}
                valuemax={this.maxValue}
                valuemin={this.minValue}
                required={this.required}
                invalid={this.invalid}
                onChange={this.handleChange}
            />,
            <limel-example-controls>
                <limel-checkbox
                    checked={this.required}
                    label="Required"
                    onChange={this.setRequired}
                />
                <limel-checkbox
                    checked={this.invalid}
                    label="Invalid"
                    onChange={this.setInvalid}
                />
            </limel-example-controls>,
        ];
    }

    private handleChange = (event: CustomEvent<number>) => {
        this.value = event.detail;
    };

    private setRequired = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.required = event.detail;
    };

    private setInvalid = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.invalid = event.detail;
    };
}
