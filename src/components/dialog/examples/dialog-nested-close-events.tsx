import { Component, h, State } from '@stencil/core';

/**
 * Nested `close` events
 *
 * When putting other elements that emit `close` events inside a dialog, those
 * events must be caught and stopped inside the dialog. If not, they will bubble
 * to the event handler listening for `close` events on the dialog, which will
 * close the dialog too.
 *
 * This example has an event handler for the `close` event on the dialog, and
 * a second event handler for the `close` event on the collapsible-section.
 *
 * Try it out with the _Stop the inner close-event_ switch disabled, and then
 * with the switch enabled, to see the difference.
 */
@Component({
    tag: 'limel-example-dialog-nested-close-events',
    shadow: true,
})
export class DialogNestedCloseEventsExample {
    @State()
    private isOpen = false;

    @State()
    private stopInnerCloseEvent = false;

    public render() {
        return [
            <limel-button
                primary={true}
                label="Open"
                onClick={this.openDialog}
            />,
            <limel-dialog open={this.isOpen} onClose={this.handleCloseOnDialog}>
                <limel-collapsible-section
                    header="Click to open me"
                    onClose={this.handleCloseOnCollapsible}
                >
                    <p>Then close me again…</p>
                </limel-collapsible-section>
                <limel-button
                    label="Ok"
                    onClick={this.handleCloseOnDialog}
                    slot="button"
                />
            </limel-dialog>,
            <limel-example-controls>
                <limel-switch
                    label="Stop the inner close-event"
                    value={this.stopInnerCloseEvent}
                    onChange={this.handleStopEventChange}
                />
            </limel-example-controls>,
        ];
    }

    private openDialog = () => {
        this.isOpen = true;
    };

    private handleCloseOnDialog = () => {
        this.isOpen = false;
    };

    private handleCloseOnCollapsible = (event: CustomEvent) => {
        if (this.stopInnerCloseEvent) {
            console.log('Stopping the inner `close` event.');
            event.stopPropagation();
        } else {
            console.log('NOT stopping the inner `close` event!');
        }
    };

    private handleStopEventChange = (event: CustomEvent<boolean>) => {
        this.stopInnerCloseEvent = event.detail;
    };
}
