import { DialogHeading } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Dialog with action inside the heading
 *
 * In this example you can also see how available style properties can be used.
 */
@Component({
    tag: 'limel-example-dialog-heading-actions',
    styleUrl: 'dialog-heading.scss',
    shadow: true,
})
export class DialogHeadingActionsExample {
    @State()
    private isOpen = false;

    @State()
    private title: string = 'Title';

    @State()
    private subtitle: string = 'Subtitle';

    @State()
    private supportingText: string;

    public render() {
        const heading: DialogHeading = {
            title: this.title,
            subtitle: this.subtitle,
            supportingText: this.supportingText,
            icon: 'info',
        };

        return [
            <limel-button
                primary={true}
                label="Open"
                onClick={this.openDialog}
            />,
            <limel-dialog
                open={this.isOpen}
                onClose={this.closeDialog}
                heading={heading}
            >
                <limel-icon-button
                    label="Close"
                    icon="multiply"
                    slot="header-actions"
                    onClick={this.closeDialog}
                ></limel-icon-button>
                <p>This is a dialog with an action in the header.</p>
                <limel-button
                    label="Ok"
                    primary={true}
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
