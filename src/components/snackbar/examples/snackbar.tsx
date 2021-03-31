import { Component, Element, h, State } from '@stencil/core';

const SNACKBAR_TIMEOUT = 5000;

@Component({
    tag: 'limel-example-snackbar',
    shadow: true,
})
export class SnackbarExample {
    @Element()
    private host: HTMLLimelExampleSnackbarElement;

    @State()
    private dismissible = false;

    private snackbarWithChangingMessage: HTMLLimelSnackbarElement;

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
        this.triggerSnackbarWithChangingMessage = this.triggerSnackbarWithChangingMessage.bind(
            this
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
            <br />,
            <br />,
            <limel-button
                primary={true}
                label="Show snackbar with changing message"
                onClick={this.triggerSnackbarWithChangingMessage}
            />,
            <limel-snackbar
                message="Please do not leave your luggage unattended! It might be taken away!"
                timeout={SNACKBAR_TIMEOUT}
                dismissible={this.dismissible}
                onHide={this.snackbarWithoutActionOnHide}
            />,
            <limel-snackbar
                timeout={4000}
                dismissible={this.dismissible}
                ref={(el) =>
                    (this.snackbarWithChangingMessage = el as HTMLLimelSnackbarElement)
                }
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

    private triggerSnackbarWithChangingMessage() {
        const trigger = (message, timeoutMs) => {
            setTimeout(() => {
                this.snackbarWithChangingMessage.message = message;
                this.snackbarWithChangingMessage.show();
            }, timeoutMs);
        };

        trigger('Your luggage will be taken away in 15 seconds', 0);
        trigger('Your luggage will be taken away in 10 seconds', 5000);
        trigger('Your luggage will be taken away in 5 seconds', 10000);
        trigger('Your luggage has been taken away!', 15000);
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
