import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-button-click',
    shadow: true,
})
export class ButtonClickExample {
    @State()
    private loading = false;

    @State()
    private disabled = false;

    public render() {
        return (
            <limel-button
                label="Click me!"
                primary={true}
                loading={this.loading}
                disabled={this.disabled}
                onClick={this.onClick}
            />
        );
    }

    private onClick() {
        this.disabled = true;
        this.loading = true;

        const TIME_LOADING = 1000;
        const TIME_DISABLED = 4000;
        setTimeout(() => {
            this.loading = false;
            setTimeout(() => {
                this.disabled = false;
            }, TIME_DISABLED);
        }, TIME_LOADING);
    }
}
