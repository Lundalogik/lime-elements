import { Component, h, State } from '@stencil/core';
import {
    LoadingButtonInteraction,
    LoadingResult,
} from '../loading-button.types';

/**
 * Basic Example: Failure
 *
 * :::important
 * This example simulates a request to the server. Because these examples do not
 * _actually_ send requests to the server, we simulate a small delay, using
 * `setTimeout`. **Please do NOT copy the setTimeout to production code!**
 * :::
 */
@Component({
    tag: 'limel-example-loading-button-basic-failure',
    shadow: true,
})
export class ButtonBasicFailureExample {
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

        const handleSaveFailure = () => {
            // Call the callback provided by the event, with
            // `LoadingResult.FAILURE` as the argument, to indicate that the
            // loading (or saving, in this case), was unsuccessful. This makes
            // the button give the appropriate user feedback.
            event.detail.resolveLoading(LoadingResult.FAILURE);

            // Set `disabled` to `false`, so the user can try again.
            this.disabled = false;
        };

        // Simulate some network delay
        setTimeout(handleSaveFailure, 1000);
    };
}
