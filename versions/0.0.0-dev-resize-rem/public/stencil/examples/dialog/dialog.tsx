import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-dialog',
    shadow: true,
})
export class DialogExample {
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
                <p>This is a simple alert-dialog.</p>
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
