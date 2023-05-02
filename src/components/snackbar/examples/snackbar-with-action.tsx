import { Component, Element, h, State } from '@stencil/core';

/**
 * With actions
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
        return [
            <limel-button
                label="Show snackbar"
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
                message="Your luggage has been taken away!"
                actionText="Reclaim"
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
        console.log('You claimed your luggage!');
    }

    private snackbarWithActionOnHide() {
        console.log('You were too late. Your luggage has been destroyed!');
    }

    private onChange(event: CustomEvent<boolean>) {
        this.dismissible = event.detail;
    }
}
