import { Component, State, h } from '@stencil/core';

/**
 * With actions
 * You can include a single action button inside the snackbar.
 *
 * :::important
 * Keep in mind that pressing the action button will close
 * the snackbar immediately. The user must be informed that their
 * requested action actually took place. If there is no instant
 * visual feedback (for sighted users) in the user interface that
 * informs the user about the updated state, displaying another
 * snackbar could be a good idea.
 * :::
 */
@Component({
    tag: 'limel-example-snackbar-with-action',
    shadow: true,
})
export class SnackbarExample {
    @State()
    private isOpen = false;

    public render() {
        const timeout = 7000;

        return [
            <limel-button label="Send" onClick={this.triggerSnackbar} />,
            <limel-snackbar
                message="Your email has been sent."
                actionText="Undo"
                timeout={timeout}
                open={this.isOpen}
                onAction={this.snackbarOnAction}
                onHide={this.snackbarWithActionOnHide}
            />,
        ];
    }

    private triggerSnackbar = () => {
        this.isOpen = true;
    };

    private snackbarOnAction = () => {
        console.log('All good. We did not send the email.');
        this.isOpen = false;
    };

    private snackbarWithActionOnHide = () => {
        console.log(
            'Now the email has really been sent! There is no way to undo this.',
        );
        this.isOpen = false;
    };
}
