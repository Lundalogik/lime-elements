import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-slider',
    shadow: true,
})
export class SliderExample {
    @State()
    private disabled = false;

    @State()
    private value = 25;

    private minValue = 15;
    private maxValue = 75;

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
                    onChange={this.changeHandler}
                />
                <limel-flex-container justify="end">
                    <limel-checkbox
                        checked={this.disabled}
                        label="Disabled"
                        onChange={this.setDisabled}
                    />
                </limel-flex-container>
                <limel-example-value value={this.value} />
            </section>
        );
    }

    private changeHandler = (event: CustomEvent<number>) => {
        this.value = event.detail;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };
}
