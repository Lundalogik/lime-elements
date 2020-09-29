import { Component, Element, h, State } from '@stencil/core';

const SNACKBAR_TIMEOUT = 5000;

@Component({
    tag: 'limel-example-snackbar',
    shadow: true,
})
export class PickerExample {
    @Element()
    private host: HTMLLimelExampleSnackbarElement;

    @State()
    private dismissible = false;

    private triggerSnackbarWithoutAction: (event: MouseEvent) => void;
    private triggerSnackbarWithAction: (event: MouseEvent) => void;

    constructor() {
        this.triggerSnackbarWithoutAction = this.triggerSnackbar.bind(
            this,
            'limel-snackbar'
        );
        this.triggerSnackbarWithAction = this.triggerSnackbar.bind(
            this,
            'limel-snackbar:last-child'
        );
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return [
            <limel-checkbox
                label="Dismissible"
                checked={this.dismissible}
                onChange={this.onChange}
            />,
            <br />,
            <br />,
            <limel-button
                primary={true}
                label="Show snackbar"
                onClick={this.triggerSnackbarWithoutAction}
            />,
            <br />,
            <br />,
            <limel-button
                primary={true}
                label="Show snackbar with action"
                onClick={this.triggerSnackbarWithAction}
            />,
            <limel-snackbar
                message="Please do not leave your luggage unattended! It might be taken away!"
                timeout={SNACKBAR_TIMEOUT}
                dismissible={this.dismissible}
                onHide={this.snackbarWithoutActionOnHide}
            />,
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
        const snackbar: HTMLLimelSnackbarElement = this.host.shadowRoot.querySelector(
            selector
        );
        snackbar.show();
    }

    private snackbarWithoutActionOnHide() {
        console.log('It will soon be taken away!');
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
