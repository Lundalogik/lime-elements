import { DialogHeading } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Example with three action buttons
 *
 * This example shows how more than two buttons can be positioned in a dialog's
 * footer. Pay attention to how they are labeled & styled, and how you can
 * enable important actions conditionally.
 *
 * :::note
 * When it comes to details such as placement of action buttons, choice of
 * labels, and adding meaningful graphical details, it's important to follow
 * a few design conventions which are explained in
 * [this guide](#/DesignGuidelines/action-buttons.md/).
 */
@Component({
    tag: 'limel-example-dialog-action-buttons',
    shadow: true,
    styleUrl: 'dialog-action-buttons.scss',
})
export class DialogActionButtonsExample {
    @State()
    private checked = false;

    @State()
    private isOpen = false;

    public render() {
        const heading: DialogHeading = {
            title: 'Whoa…! Be careful.',
            subtitle: 'Wanna mass-update 2345 items?',
            icon: 'brake_warning',
        };

        return [
            <limel-button
                primary={true}
                label="Open"
                onClick={this.openDialog}
            />,
            <limel-dialog
                heading={heading}
                open={this.isOpen}
                onClose={this.closeDialog}
            >
                <div class="dialog-content">
                    <p>
                        You are about to update 2345 items simultaneously. This
                        will irreversibly change the affected values in the
                        database, for all of these items!
                    </p>
                    <p>Are you sure you want to update them all?</p>
                    <limel-checkbox
                        label="It's OK. I'm aware of the consequences of this action."
                        id="confirmation-checkbox"
                        required={true}
                        onChange={this.confirmed}
                        checked={this.checked}
                    />
                </div>
                <limel-button
                    label="Back to editing"
                    class="button back primary--neutral"
                    icon="left_arrow"
                    onClick={this.closeDialog}
                    slot="button"
                />
                <limel-button
                    label="Discard changes"
                    class="button discard primary--caution"
                    icon="cancel"
                    primary={true}
                    onClick={this.closeDialog}
                    slot="button"
                />
                <limel-button
                    label="Update all"
                    class="button update"
                    icon="ok"
                    primary={true}
                    onClick={this.displayFeedback}
                    disabled={!this.checked}
                    slot="button"
                />
            </limel-dialog>,
        ];
    }

    private confirmed = (event: CustomEvent<boolean>) => {
        this.checked = event.detail;
    };

    private displayFeedback = () => {
        alert(
            '2345 items are being updated in the background. This may take a few seconds…'
        );
        this.closeDialog();
    };

    private openDialog = () => {
        this.isOpen = true;
    };

    private closeDialog = () => {
        this.isOpen = false;
    };
}
