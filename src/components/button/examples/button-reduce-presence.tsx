import { Component, h, State } from '@stencil/core';

/**
 * Reduce Presence
 *
 * This example is identical to the one above, except that here, the
 * `has-reduced-presence` class has been set to `true`. This will hide the
 * button when it is disabled. However, it will also make sure that the button
 * remains visible while the loading animation is ongoing. When the animation is
 * done and the checkmark has been shown, the button will hide.
 *
 * Read more in the [Design Guidelines](/#/DesignGuidelines/decluttering.md)
 */
@Component({
    tag: 'limel-example-button-reduce-presence',
    shadow: true,
})
export class ButtonReducePresenceExample {
    @State()
    private loading = false;

    @State()
    private disabled = false;

    public render() {
        return (
            <limel-button
                class="has-reduced-presence"
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
