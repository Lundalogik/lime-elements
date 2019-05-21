import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-dialog-closing-actions',
    shadow: true,
})
export class DialogClosingActionsExample {
    @State()
    private isOpen = false;

    constructor() {
        this.triggerOnClick = this.triggerOnClick.bind(this);
        this.onClose = this.onClose.bind(this);
        this.okOnClick = this.okOnClick.bind(this);
    }

    public render() {
        return [
            <limel-button
                primary={true}
                label="Open"
                onClick={this.triggerOnClick}
            />,
            <limel-dialog
                open={this.isOpen}
                closingActions={{ escapeKey: false, scrimClick: false }}
                onClose={this.onClose}
            >
                <p>
                    This dialog doesn't close by clicking the scrim or pressing
                    the escape key. Only the Ok-button triggers a close event.
                </p>
                <limel-flex-container justify="end" slot="button">
                    <limel-button label="Ok" onClick={this.okOnClick} />
                </limel-flex-container>
            </limel-dialog>,
        ];
    }

    private triggerOnClick() {
        this.isOpen = true;
    }

    private okOnClick() {
        this.isOpen = false;
    }

    private onClose() {
        this.isOpen = false;
    }
}
