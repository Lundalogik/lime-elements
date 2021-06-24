import { Component, h, State } from '@stencil/core';

/**
 * Fullscreen
 */
@Component({
    tag: 'limel-example-dialog-fullscreen',
    shadow: true,
})
export class DialogSizeExample {
    @State()
    private isOpen = false;

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
                <limel-button
                    label="Ok"
                    onClick={this.closeDialog}
                    slot="button"
                />
            </limel-dialog>,
        ];
    }

    private openDialog = () => {
        this.isOpen = true;
    };

    private closeDialog = () => {
        this.isOpen = false;
    };
}
