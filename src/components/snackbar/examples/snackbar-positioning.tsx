import { Component, Element, h } from '@stencil/core';

/**
 * Positioning on large and small screens
 *
 * Snackbars are by default center-aligned and placed at the bottom of the screen.
 * However, on larger screens, they can optionally be displayed on the leading edge
 * which would be the left side in LTR, or the right side in RTL.
 *
 * To do so, you can take advantage of the provided CSS variables,
 * and keep in mind that the Snackbar uses `position: fixed;`
 * to determine its location.
 *
 * :::tip
 * When customizing the Snackbars for usage in progressive web applications,
 * remember to consider the safe areas, and add the
 * [environment variables](https://developer.mozilla.org/en-US/docs/Web/CSS/env)
 * in your calculations.
 *
 * For example: `--snackbar-bottom: env(safe-area-inset-left, 0)`.
 * :::
 */
@Component({
    tag: 'limel-example-snackbar-positioning',
    shadow: true,
    styleUrl: 'snackbar-positioning.scss',
})
export class SnackbarPositioningExample {
    @Element()
    private host: HTMLLimelExampleSnackbarElement;

    private triggerSnackbarWithoutAction: (event: MouseEvent) => void;

    constructor() {
        this.triggerSnackbarWithoutAction = this.triggerSnackbar.bind(
            this,
            'limel-snackbar'
        );
    }

    public render() {
        return [
            <limel-button
                label="Show snackbar"
                onClick={this.triggerSnackbarWithoutAction}
            />,
            <limel-snackbar message="This Snackbar is placed at the top-right of the screen." />,
        ];
    }

    private triggerSnackbar(selector) {
        const snackbar: HTMLLimelSnackbarElement =
            this.host.shadowRoot.querySelector(selector);
        snackbar.show();
    }
}
