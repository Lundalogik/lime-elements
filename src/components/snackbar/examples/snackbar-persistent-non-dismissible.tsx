import { Component, State, h } from '@stencil/core';

/**
 * Persistent and non-dismissible
 * In some scenarios, a Snackbar that is persistent
 * can simultaneously be non-dismissible.
 *
 * This is good for handling cases in which the system tries to
 * communicate an ongoing background process or a status that the user
 * cannot take an action on, but should be kept informed about.
 *
 * In such cases, you should programmatically close the Snackbar
 * when the process is completed or the status changes!
 */
@Component({
    tag: 'limel-example-snackbar-persistent-non-dismissible',
    shadow: true,
})
export class SnackbarPersistentNonDismissibleExample {
    @State()
    private isOpen = false;

    public render() {
        return [
            <limel-button
                label="Show a persistent & non-dismissible alert"
                onClick={this.triggerSnackbar}
            />,
            <limel-snackbar
                message="Your internet connection was lost! Hang on while we're trying to reconnect…"
                timeout={0}
                open={this.isOpen}
                dismissible={false}
                onHide={this.handleHide}
            />,
            <limel-example-controls
                style={{ '--example-controls-column-layout': 'auto-fit' }}
            >
                <limel-switch
                    label="Toggle online status"
                    onChange={this.handleChange}
                />
            </limel-example-controls>,
        ];
    }

    private triggerSnackbar = () => {
        this.isOpen = true;
    };

    private handleChange = (event: CustomEvent<boolean>) => {
        if (!this.isOpen) {
            return;
        }

        if (!event.detail) {
            return;
        }

        this.isOpen = false;
    };

    private handleHide = () => {
        this.isOpen = false;
    };
}
