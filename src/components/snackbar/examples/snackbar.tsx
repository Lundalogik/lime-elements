import { Component, Element, h, State } from '@stencil/core';

/**
 * Basic example
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
                message="Please do not leave your luggage unattended! It might be taken away!"
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
