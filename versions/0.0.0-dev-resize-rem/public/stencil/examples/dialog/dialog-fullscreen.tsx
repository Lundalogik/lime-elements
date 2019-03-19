import { Component, State } from '@stencil/core';

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
                onClick={() => {
                    this.isOpen = true;
                }}
            />,
            <limel-dialog
                open={this.isOpen}
                fullscreen={true}
                onClose={() => {
                    this.isOpen = false;
                }}
            >
                <p>This dialog is fullscreen</p>
                <limel-button-group slot="button">
                    <limel-button
                        label="Ok"
                        onClick={() => {
                            this.isOpen = false;
                        }}
                    />
                </limel-button-group>
            </limel-dialog>,
        ];
    }
}
