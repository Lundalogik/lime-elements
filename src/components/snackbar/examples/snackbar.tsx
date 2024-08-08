import { Component, h, State } from '@stencil/core';

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
    @State()
    private isOpen: boolean = false;

    public render() {
        return [
            <limel-button
                label="Show snackbar"
                onClick={this.handleShowSnackbar}
            />,
            <limel-snackbar
                open={this.isOpen}
                message="Quick scan started. It takes a couple of minutes…"
                onHide={this.handleHideSnackbar}
            />,
        ];
    }

    private handleShowSnackbar = () => {
        this.isOpen = true;
    };

    private handleHideSnackbar = () => {
        this.isOpen = false;
        console.log('The scan is still going on in the background.');
    };
}
