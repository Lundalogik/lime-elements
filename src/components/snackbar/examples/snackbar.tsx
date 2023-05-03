import { Component, Element, h, State } from '@stencil/core';

/**
 * Basic example
 *
 * Snackbars should not necessarily require a deliberate action from the user to dismiss them.
 * This is why the component has a default `timeout` and will disappear even if the user
 * does not interact with it.
 *
 * As you see in this example, there is no `timeout` specified.
 * Therefore the snackbar will automatically disappear after a few seconds.
 *
 * :::important
 * Make sure to set a proper timeout, based on the length of the text.
 * An average user must be able to read the full message within the given
 * time!
 * :::
 */
@Component({
    tag: 'limel-example-snackbar',
    shadow: true,
})
export class SnackbarExample {
    @Element()
    private host: HTMLLimelExampleSnackbarElement;

    @State()
    private dismissible = false;

    private triggerSnackbarWithoutAction: (event: MouseEvent) => void;

    constructor() {
        this.triggerSnackbarWithoutAction = this.triggerSnackbar.bind(
            this,
            'limel-snackbar'
        );
        this.onChange = this.onChange.bind(this);
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
                message="Quick scan started. It takes a couple of minutes…"
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
        console.log('It will soon be taken away!');
    }

    private onChange(event: CustomEvent<boolean>) {
        this.dismissible = event.detail;
    }
}
