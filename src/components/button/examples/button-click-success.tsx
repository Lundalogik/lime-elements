import { Component, h, State } from '@stencil/core';

/**
 * With click handler
 *
 * The click handler in this example simulates saving some changed values in a
 * form. When the button is clicked, the `loading` attribute is set to `true`.
 * After a short while, we pretend that the saving was successful, and set
 * `loading` to `false`. We also set `disabled` to `true`, because we just
 * successfully saved, so until the user updates our imaginary form again, there
 * is nothing to save.
 *
 * When the `loading` attribute changes from `true` to `false`, the button
 * automatically displays a checkmark icon for 2 seconds. Note that our click
 * handler isn't actually involved in this.
 *
 * A short while after the checkmark has disappeared, we enable the button
 * again. This is just so that you can try the functionality again. Normally,
 * the button would stay disabled until the user made some changes, so there's
 * something new to save!
 */
@Component({
    tag: 'limel-example-button-click-success',
    shadow: true,
})
export class ButtonClickSuccessExample {
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
        this.loading = true;

        const TIME_LOADING = 1000;
        const TIME_DISABLED = 5000;
        setTimeout(() => {
            this.loading = false;
            this.disabled = true;
            setTimeout(() => {
                this.disabled = false;
            }, TIME_DISABLED);
        }, TIME_LOADING);
    }
}
