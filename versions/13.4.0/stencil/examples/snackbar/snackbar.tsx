import { Component, Element } from '@stencil/core';

const SNACKBAR_TIMEOUT = 5000;

@Component({
    tag: 'limel-example-snackbar',
    shadow: true,
})
export class PickerExample {
    @Element()
    private host: HTMLElement;

    public render() {
        return [
            <limel-button
                primary={true}
                label="Show snackbar"
                onClick={this.triggerSnackbar.bind(this, 'limel-snackbar')}
            />,
            <br />,
            <br />,
            <limel-button
                primary={true}
                label="Show snackbar with action"
                onClick={this.triggerSnackbar.bind(
                    this,
                    'limel-snackbar:last-child'
                )}
            />,
            <limel-snackbar
                message="Please do not leave your luggage unattended! It might be taken away!"
                multiline={true}
                timeout={SNACKBAR_TIMEOUT}
                onHide={() => {
                    console.log('It will soon be taken away!');
                }}
            />,
            <limel-snackbar
                message="Your luggage has been taken away!"
                actionText="Reclaim"
                onAction={() => {
                    console.log('You try to claim your luggage...');
                }}
                onHide={() => {
                    console.log(
                        'You were too late. Your luggage has been destroyed!'
                    );
                }}
            />,
        ];
    }

    private triggerSnackbar(selector) {
        const snackbar: HTMLLimelSnackbarElement = this.host.shadowRoot.querySelector(
            selector
        );
        snackbar.show();
    }
}
