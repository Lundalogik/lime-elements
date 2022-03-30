import { Component, h, State } from '@stencil/core';

/**
 * With click handler
 *
 * The click handler in this example sets the attributes `loading` and
 * `disabled` to `true`. After 1 second, the `loading` attribute is set to
 * `false` again. After another 5 seconds, the button is once again enabled.
 *
 * When the `loading` attribute changes from `true` to `false`, the button
 * automatically displays a checkmark icon for 2 seconds. Note that our click
 * handler isn't actually involved in this.
 */
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
        const TIME_DISABLED = 5000;
        setTimeout(() => {
            this.loading = false;
            setTimeout(() => {
                this.disabled = false;
            }, TIME_DISABLED);
        }, TIME_LOADING);
    }
}
