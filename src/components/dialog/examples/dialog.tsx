import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-dialog',
    shadow: true,
})
export class DialogExample {
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
            <limel-dialog open={this.isOpen} onClose={this.closeDialog}>
                <p>This is a simple alert-dialog.</p>
                <limel-button
                    label="Ok"
                    onClick={this.closeDialog}
                    slot="button"
                />
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
