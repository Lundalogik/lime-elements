import { Component, h, State } from '@stencil/core';
// import { LoadingButtonInteraction, LoadingResult } from '@limetech/lime-elements';
import {
    LoadingButtonInteraction,
    LoadingResult,
} from '../loading-button.types';

/**
 * Basic Example: Success
 *
 * :::important
 * This example simulates a request to the server. Because these examples do not
 * _actually_ send requests to the server, we simulate a small delay, using
 * `setTimeout`. **Please do NOT copy the setTimeout to production code!**
 * :::
 */
@Component({
    tag: 'limel-example-loading-button-basic-success',
    shadow: true,
})
export class ButtonBasicSuccessExample {
    @State()
    private disabled = false;

    public render() {
        return (
            <limel-loading-button
                label="Save"
                disabled={this.disabled}
                onInteract={this.save}
            />
        );
    }

    private save = (event: CustomEvent<LoadingButtonInteraction>) => {
        this.disabled = true;
        event.detail.indicateLoading();

        const handleSaveSuccess = () => {
            // Call the callback provided by the event, with
            // `LoadingResult.SUCCESS` as the argument, to indicate that the
            // loading (or saving, in this case), succeeded. This makes the
            // button give the appropriate user feedback.
            event.detail.resolveLoading(LoadingResult.SUCCESS);

            // Normally, in the case of saving something, the button should
            // probably stay disabled, until the user changes something. But
            // since this is a demo, we want to reset the state, so you can try
            // the functionality again.
            setTimeout(() => {
                this.disabled = false;
            }, 3000);
        };

        // Simulate some network delay
        setTimeout(handleSaveSuccess, 1000);
    };
}
