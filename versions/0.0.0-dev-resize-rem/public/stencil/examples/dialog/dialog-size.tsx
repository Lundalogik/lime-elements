import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-dialog-size',
    shadow: true,
    styleUrl: 'dialog-size.scss',
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
                onClose={() => {
                    this.isOpen = false;
                }}
            >
                <p>This dialog has a custom size set through CSS variables:</p>
                <p>
                    <code>--dialog-width: 0.625*40rem</code>
                </p>
                <p>
                    <code>--dialog-height: 50%</code>
                </p>
                <limel-flex-container justify="end" slot="button">
                    <limel-button
                        label="Ok"
                        onClick={() => {
                            this.isOpen = false;
                        }}
                    />
                </limel-flex-container>
            </limel-dialog>,
        ];
    }
}
