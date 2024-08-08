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
    private isOpen = false;

    @State()
    private message: string;

    public render() {
        return [
            <limel-button
                label="Spam me"
                onClick={this.triggerSnackbarWithChangingMessage}
            />,
            <limel-snackbar
                message={this.message}
                open={this.isOpen}
                timeout={4000}
                onHide={this.handleHide}
            />,
        ];
    }

    private triggerSnackbarWithChangingMessage = () => {
        const trigger = (message, timeoutMs) => {
            setTimeout(() => {
                this.message = message;
                this.isOpen = true;
            }, timeoutMs);
        };

        trigger('We will show you a new message in 5 seconds', 0);
        trigger('You will see another message in 5 seconds', 5000);
        trigger('The last message comes in 5 seconds', 10000);
        trigger('There will be no more messages!', 15000);
    }

    private handleHide = () => {
        this.isOpen = false;
    };
}
