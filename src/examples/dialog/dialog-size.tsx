import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-dialog-size',
    shadow: true,
    styleUrl: 'dialog-size.scss',
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
            <limel-dialog open={this.isOpen} onClose={this.closeDialog}>
                <p>This dialog has a custom size set through CSS variables:</p>
                <p>
                    <code>--dialog-width: pxToRem(400)</code>
                </p>
                <p>
                    <code>--dialog-height: 50%</code>
                </p>
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
