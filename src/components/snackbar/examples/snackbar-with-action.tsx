import { Component, Element, h, State } from '@stencil/core';

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
    @Element()
    private host: HTMLLimelExampleSnackbarWithActionElement;

    @State()
    private dismissible = false;

    private triggerSnackbarWithAction: (event: MouseEvent) => void;

    constructor() {
        this.triggerSnackbarWithAction = this.triggerSnackbar.bind(
            this,
            'limel-snackbar'
        );
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        const timeout = 7000;

        return [
            <limel-button
                label="Send"
                onClick={this.triggerSnackbarWithAction}
            />,
            <limel-example-controls>
                <limel-checkbox
                    label="Dismissible"
                    checked={this.dismissible}
                    onChange={this.onChange}
                />
            </limel-example-controls>,
            <limel-snackbar
                message="Your email has been sent."
                actionText="Undo"
                timeout={timeout}
                dismissible={this.dismissible}
                onAction={this.snackbarOnAction}
                onHide={this.snackbarWithActionOnHide}
            />,
        ];
    }

    private triggerSnackbar(selector) {
        const snackbar: HTMLLimelSnackbarElement =
            this.host.shadowRoot.querySelector(selector);
        snackbar.show();
    }

    private snackbarOnAction() {
        console.log('All good. We did not send the email.');
    }

    private snackbarWithActionOnHide() {
        console.log(
            'Now the email has really been sent! There is no way to undo this.'
        );
    }

    private onChange(event: CustomEvent<boolean>) {
        this.dismissible = event.detail;
    }
}
