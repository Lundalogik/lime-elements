import { Component, h, State } from '@stencil/core';

/**
 * With changing messages
 */
@Component({
    tag: 'limel-example-snackbar-with-changing-messages',
    shadow: true,
})
export class SnackbarExample {
    @State()
    private dismissible = false;

    private snackbarWithChangingMessage: HTMLLimelSnackbarElement;

    constructor() {
        this.triggerSnackbarWithChangingMessage =
            this.triggerSnackbarWithChangingMessage.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return [
            <limel-button
                label="Show snackbar"
                onClick={this.triggerSnackbarWithChangingMessage}
            />,
            <limel-example-controls>
                <limel-checkbox
                    label="Dismissible"
                    checked={this.dismissible}
                    onChange={this.onChange}
                />
            </limel-example-controls>,
            <limel-snackbar
                timeout={4000}
                dismissible={this.dismissible}
                ref={(el) =>
                    (this.snackbarWithChangingMessage =
                        el as HTMLLimelSnackbarElement)
                }
            />,
        ];
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

    private onChange(event: CustomEvent<boolean>) {
        this.dismissible = event.detail;
    }
}
