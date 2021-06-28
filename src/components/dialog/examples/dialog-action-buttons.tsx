import { DialogHeading } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Example with three action buttons
 *
 * Check this out to see how buttons are positioned, labeled, and how you may be
 * able to conditionally enable important actions.
 * :::note
 * When it comes to these detail such placement of action buttons, choice of
 * labels, and adding meaningful graphical details, it's important to follow
 * a few design conventions, which are explained [here in this guide]
 * (#/DesignGuidelines/action-buttons.md/).
 */
@Component({
    tag: 'limel-example-action-buttons',
    shadow: true,
    styleUrl: 'dialog-action-buttons.scss',
})
export class DialogActionButtonsExample {
    @State()
    private checked: boolean = false;

    @State()
    private isOpen = false;

    public render() {
        const heading: DialogHeading = {
            title: 'Woah…! Be careful.',
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
                        You are about to update 2345 items simulatiously. This
                        will irriversibly change their tweaked values in the
                        database! Are you sure you want to update them all?
                    </p>
                    <limel-checkbox
                        label="It's OK. I'm aware of the consequences of this action."
                        id="confirmation-checkbox"
                        required={true}
                        onChange={this.confirmed}
                        checked={this.checked}
                    />
                </div>
                <limel-flex-container slot="button">
                    <limel-button
                        label="Back to editing"
                        class="button back primary--neutral justify-left"
                        icon="left_arrow"
                        onClick={this.closeDialog}
                    />
                    <limel-button
                        label="Discard changes"
                        class="button discard primary--caution"
                        icon="cancel"
                        primary={true}
                        onClick={this.closeDialog}
                    />
                    <limel-button
                        label="Update all"
                        class="button update"
                        icon="ok"
                        primary={true}
                        onClick={this.displayFeedback}
                        disabled={!this.checked}
                    />
                </limel-flex-container>
            </limel-dialog>,
        ];
    }

    private confirmed = () => {
        this.checked = !this.checked;
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
