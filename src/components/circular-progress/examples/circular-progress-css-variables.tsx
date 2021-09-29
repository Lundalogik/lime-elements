import { Component, h } from '@stencil/core';
/**
 * Tweaking the style, using CSS variables
 * The component offers a few possibilites for tweaking its size using
 * `--circular-progress-size`, as well as `--circular-progress-fill-color` and
 * `--circular-progress-track-color` for changing its colors.
 *
 * :::note
 * If you have tweaked component's size using size presets offered by the
 * `size` prop, the css variable of `--circular-progress-size` will not have any
 * effect.
 * :::
 * :::important
 * Make sure that the track color is lighter than the fill color. Otherwise the
 * UI will be very confusing for the users.
 * :::
 */

@Component({
    shadow: true,
    tag: 'limel-example-circular-progress-css-variables',
    styleUrl: 'circular-progress-css-variables.scss',
})
export class CircularProgressCssVariablesExample {
    private value = 90;

    public render() {
        return <limel-circular-progress value={this.value} />;
    }
}
