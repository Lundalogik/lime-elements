import { Component, h, State } from '@stencil/core';

/**
 * With click handler, and failed feedback
 *
 * This example works just like the "With click handler" example, except that,
 * when the `loading` attribute changes from `true` to `false`, the button
 * automatically indicates that the previously ongoing process just failed.
 */
@Component({
    tag: 'limel-example-button-click-fail',
    shadow: true,
})
export class ButtonClickFailExample {
    @State()
    private loading = false;

    @State()
    private disabled = false;

    @State()
    private loadingFailed = false;

    public render() {
        return (
            <limel-button
                label="Click me!"
                primary={true}
                loading={this.loading}
                disabled={this.disabled}
                onClick={this.onClick}
                loadingFailed={this.loadingFailed}
            />
        );
    }

    private onClick() {
        this.disabled = true;
        this.loading = true;
        this.loadingFailed = false;

        const TIME_LOADING = 2000;

        setTimeout(() => {
            this.loading = false;
            this.disabled = false;
            this.loadingFailed = true;
        }, TIME_LOADING);
    }
}
