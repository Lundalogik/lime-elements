import { Component, h, State } from '@stencil/core';

/**
 * Custom closing actions
 *
 * Action buttons in dialogs can be used to add a clear visual indication for
 * the sighted users to realize that the dialog can be closed by pressing
 * a button as well.
 * This may sometimes be considered an unnecessary usage of action buttons for
 * sighted users. Because majority of them users know that clicking or tapping
 * outside the dialog closes it.
 *
 * Such buttons are usually labeled ***OK***, ***Dismiss*** or ***Close***.
 *
 * :::tip
 * When to use action buttons for simple "close" actions?
 * - In fullscreen dialogs where clicking outside to close is hard.
 * - When big dialogs are opened on phones, which make tapping outside hard for users.
 * - When designing with accessibility in mind, and for those users who
 * use screen readers to navigate the user interface.
 * :::
 *
 * But sometimes, depending on the importance of the message which is displayed,
 * you have to choose to display a close button, and disable other means of
 * dismissing the dialog.
 *
 * :::tip
 * When to use custom closing actions?
 * - To make sure that the user really reads and understands the dialog's content.
 * - To make sure that the user does not accidentally click outside and close the dialog.
 * :::
 *
 * For such cases, avoid generic labels like ***OK***, or ***Close*** which unconsciously
 * motivate users to dismiss the message; and instead use more purposeful labels
 * such as ***I understand***, ***Looks good!***, ***Continue***, and similar;
 * like in the example below.
 */

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
                onClick={this.openDialog}
            />,
            <limel-dialog
                open={this.isOpen}
                closingActions={{ escapeKey: false, scrimClick: false }}
                onClose={this.closeDialog}
            >
                <p>
                    This dialog doesn't close by clicking the scrim or pressing
                    the escape key. Only the button triggers a close event.
                </p>
                <limel-button
                    label="I understand"
                    onClick={this.handleConfirmClick}
                    slot="button"
                />
            </limel-dialog>,
        ];
    }

    private openDialog = () => {
        this.isOpen = true;
    };

    private handleConfirmClick = () => {
        this.isOpen = false;
    };

    private closeDialog = () => {
        this.isOpen = false;
    };
}
