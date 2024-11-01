import { Component, State, h } from '@stencil/core';

/**
 * Persistent
 * Dismissive Snackbars appear temporarily, and disappear automatically
 * without requiring users to manually dismiss them.
 * However, sometimes you may need to display a Snackbar
 * which keeps being displayed persistently until the user deliberately takes
 * an action or clicks the dismiss button. This could be to ensure that
 *
 * - the user actually reads message that is being displayed.
 * - has time to take an informed decision to press the action button.
 *
 * To make a Snackbar persistent, set the `timeout` property to `-1`.
 */
@Component({
    tag: 'limel-example-snackbar-persistent',
    shadow: true,
})
export class SnackbarPersistentExample {
    @State()
    private isOpen = false;

    public render() {
        return [
            <limel-button
                label="Show a persistent alert"
                onClick={this.triggerSnackbar}
            />,
            <limel-snackbar
                message="We use cookies to deliver services and analyze traffic."
                actionText="Okay, I got it!"
                open={this.isOpen}
                timeout={-1}
                onAction={this.snackbarOnAction}
                onHide={this.handleHide}
            />,
        ];
    }

    private triggerSnackbar = () => {
        this.isOpen = true;
    };

    private snackbarOnAction = () => {
        console.log(
            'Great! You have just agreed with our terms & conditions without reading it.',
        );
        this.isOpen = false;
    };

    private handleHide = () => {
        this.isOpen = false;
    };
}
