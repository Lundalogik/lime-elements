import { Component, Element, h, State } from '@stencil/core';

/**
 * Dismissible
 * By default, snackbars display a dismiss button.
 * This allows users to close them at any time, before they time out.
 *
 * The reason for this default behavior is that snackbars could be
 * covering other important content on the screen,
 * or simply have a timeout longer than the time it takes
 * for the user to read the message.
 *
 * However, you can override this default interaction design by setting the
 * `dismissible` property to `false`, which removes the close button.
 */
@Component({
    tag: 'limel-example-snackbar-dismissible',
    shadow: true,
})
export class SnackbarExample {
    @Element()
    private host: HTMLLimelExampleSnackbarElement;

    @State()
    private dismissible = true;

    private triggerSnackbarWithoutAction: (event: MouseEvent) => void;

    constructor() {
        this.triggerSnackbarWithoutAction = this.triggerSnackbar.bind(
            this,
            'limel-snackbar',
        );
    }

    public render() {
        return [
            <limel-button
                label="Show snackbar"
                onClick={this.triggerSnackbarWithoutAction}
            />,
            <limel-example-controls>
                <limel-checkbox
                    label="Dismissible"
                    checked={this.dismissible}
                    onChange={this.onChange}
                />
            </limel-example-controls>,
            <limel-snackbar
                message="Your internet connection is restored!"
                dismissible={this.dismissible}
                onHide={this.snackbarWithoutActionOnHide}
            />,
        ];
    }

    private triggerSnackbar(selector) {
        const snackbar: HTMLLimelSnackbarElement =
            this.host.shadowRoot.querySelector(selector);
        snackbar.show();
    }

    private snackbarWithoutActionOnHide() {
        console.log('We will try to reconnect if the connection drops again.');
    }

    private onChange = (event: CustomEvent<boolean>) => {
        this.dismissible = event.detail;
    };
}
