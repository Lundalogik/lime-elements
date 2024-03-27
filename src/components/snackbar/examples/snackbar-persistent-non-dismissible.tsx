import { Component, Element, State, h } from '@stencil/core';

/**
 * Persistent and non-dismissible
 * In some scenarios, a Snackbar that is persistent
 * can simultaneously be non-dismissible.
 *
 * This is good for handling cases in which the system tries to
 * communicate an ongoing background process or a status that the user
 * cannot take an action on.
 */
@Component({
    tag: 'limel-example-snackbar-persistent-non-dismissible',
    shadow: true,
})
export class SnackbarPersistentNonDismissibleExample {
    @Element()
    private host: HTMLLimelSnackbarElement;

    private triggerSnackbarWithAction: (event: MouseEvent) => void;

    @State()
    private persistent: boolean = true;

    private isShowingSnackbar: boolean = false;

    constructor() {
        this.triggerSnackbarWithAction = this.triggerSnackbar.bind(this);
    }

    public render() {
        return [
            <limel-button
                label="Show a persistent & non-dismissible alert"
                onClick={this.triggerSnackbarWithAction}
            />,
            <limel-snackbar
                message="Your internet connection was lost! Hang on while we're trying to reconnect…"
                persistent={this.persistent}
                dismissible={false}
            />,
            <limel-example-controls
                style={{ '--example-controls-column-layout': 'auto-fit' }}
            >
                <limel-switch
                    label="Toggle online status"
                    value={this.persistent}
                    onChange={this.handleChange}
                />
            </limel-example-controls>,
        ];
    }

    private triggerSnackbar() {
        if (!this.isShowingSnackbar) {
            this.snackbarElement.show();
        }

        this.isShowingSnackbar = true;
    }

    private handleChange = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.persistent = event.detail;
    };

    private get snackbarElement(): HTMLLimelSnackbarElement {
        return this.host.shadowRoot.querySelector('limel-snackbar');
    }
}
