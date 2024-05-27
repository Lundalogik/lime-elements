import { Component, Element, h } from '@stencil/core';

/**
 * Persistent
 * Dismissive Snackbars appear temporarily, and disappear automatically
 * without requiring users to manually dismiss them.
 * However, sometimes you may need to display a Snackbar
 * which keeps being displayed persistently until the user deliberately takes
 * an action or clicks the dismiss button. This could be to ensure that
 *
 * - the user actually reads message that is being displayed.
 * - the user has time to take an informed decision to press the action button.
 */
@Component({
    tag: 'limel-example-snackbar-persistent',
    shadow: true,
})
export class SnackbarPersistentExample {
    @Element()
    private host: HTMLLimelSnackbarElement;

    private triggerSnackbarWithAction: (event: MouseEvent) => void;

    constructor() {
        this.triggerSnackbarWithAction = this.triggerSnackbar.bind(
            this,
            'limel-snackbar'
        );
    }

    public render() {
        return [
            <limel-button
                label="Show a persistent alert"
                onClick={this.triggerSnackbarWithAction}
            />,
            <limel-snackbar
                message="We use cookies to deliver services and analyze traffic."
                actionText="Okay, I got it!"
                persistent={true}
                onAction={this.snackbarOnAction}
            />,
        ];
    }

    private triggerSnackbar(selector) {
        const snackbar: HTMLLimelSnackbarElement =
            this.host.shadowRoot.querySelector(selector);
        snackbar.show();
    }

    private snackbarOnAction() {
        console.log(
            'Great! You have just agreed with our terms & conditions without reading it.'
        );
    }
}
