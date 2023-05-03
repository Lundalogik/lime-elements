import { Component, h } from '@stencil/core';

/**
 * With changing messages
 */
@Component({
    tag: 'limel-example-snackbar-with-changing-messages',
    shadow: true,
})
export class SnackbarExample {
    private snackbarWithChangingMessage: HTMLLimelSnackbarElement;

    constructor() {
        this.triggerSnackbarWithChangingMessage =
            this.triggerSnackbarWithChangingMessage.bind(this);
    }

    public render() {
        return [
            <limel-button
                label="Spam me"
                onClick={this.triggerSnackbarWithChangingMessage}
            />,
            <limel-snackbar
                timeout={4000}
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

        trigger('We will show you a new message in 15 seconds', 0);
        trigger('You will see another message in 10 seconds', 5000);
        trigger('The last message comes in 5 seconds', 10000);
        trigger('There will be no more messages!', 15000);
    }
}
