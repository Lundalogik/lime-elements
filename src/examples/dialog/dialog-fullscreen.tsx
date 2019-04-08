import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-dialog-fullscreen',
    shadow: true,
})
export class DialogSizeExample {
    @State()
    private isOpen = false;

    constructor() {
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    public render() {
        return [
            <limel-button
                primary={true}
                label="Open"
                onClick={this.openDialog}
            />,
            <limel-dialog
                open={this.isOpen}
                fullscreen={true}
                onClose={this.closeDialog}
            >
                <p>This dialog is fullscreen</p>
                <limel-flex-container justify="end" slot="button">
                    <limel-button label="Ok" onClick={this.closeDialog} />
                </limel-flex-container>
            </limel-dialog>,
        ];
    }

    private openDialog() {
        this.isOpen = true;
    }

    private closeDialog() {
        this.isOpen = false;
    }
}
