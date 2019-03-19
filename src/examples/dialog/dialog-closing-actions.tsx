import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-dialog-closing-actions',
    shadow: true,
})
export class DialogClosingActionsExample {
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
                closingActions={{ escapeKey: false, scrimClick: false }}
                onClose={() => {
                    this.isOpen = false;
                }}
            >
                <p>
                    This dialog doesn't close by clicking the scrim or pressing
                    the escape key. Only the Ok-button triggers a close event.
                </p>
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
