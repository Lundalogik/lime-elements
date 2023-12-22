import { Component, Element, h, State } from '@stencil/core';

/**
 * Dismissible
 * By default, snackbars display a dismiss button.
 * This allows users to close them at any time, before they time out.
 *
 * The reasons for this default behavior is that
 * there could be multiple snackbars on the screen, covering each other.
 * Also, snackbars could be covering other important content on the screen,
 * or have unreasonably long timeout.
 *
 * However, you can override this default interaction design by setting the
 * `dismissible` property to `false`.
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
            'limel-snackbar'
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
