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
        this.trigger('We will show you a new message in 5 seconds', 0);
        this.trigger('You will see another message in 5 seconds', 5000);
        this.trigger('The last message comes in 5 seconds', 10_000);
        this.trigger('There will be no more messages!', 15_000);
    };

    private trigger = (message: string, timeoutMs: number) => {
        setTimeout(() => {
            this.message = message;
            this.isOpen = true;
        }, timeoutMs);
    };

    private handleHide = () => {
        this.isOpen = false;
    };
}
