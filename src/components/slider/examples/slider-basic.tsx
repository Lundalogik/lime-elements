import { Component, h, State } from '@stencil/core';

/**
 * Basic example
 */
@Component({
    tag: 'limel-example-slider-basic',
    shadow: true,
})
export class SliderBasicExample {
    @State()
    private disabled = false;

    @State()
    private readonly = false;

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
                disabled={this.disabled}
                readonly={this.readonly}
                onChange={this.handleChange}
            />,
            <limel-example-controls>
                <limel-checkbox
                    checked={this.disabled}
                    label="Disabled"
                    onChange={this.setDisabled}
                />
                <limel-checkbox
                    checked={this.readonly}
                    label="Readonly"
                    onChange={this.setReadonly}
                />
            </limel-example-controls>,
            <limel-example-value value={this.value} />,
        ];
    }

    private handleChange = (event: CustomEvent<number>) => {
        this.value = event.detail;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };
}
