import { Component, h } from '@stencil/core';

/**
 * Dialogs with several action buttons
 *
 * Sometimes dialogs come with several action buttons. They are used to ensure
 * that the user delibrately confirms an action, from a set of actions which are
 * often contradictory; for example **Discard** versus **Save**.
 * :::note
 * There are a few design conventions that you must follow, when presenting
 * several action buttons. Look at the example below to get a better understanding
 * of these conventions.
 * :::
 *
 * ##### Placement
 * On a user interface which is designed for a left-to-right
 * script like English, action buttons of a dialog are
 * typically located on the bottom-right corner. In that slot,
 * the Positive action is always on the right side, and the
 * negative one is on the left.
 */
@Component({
    tag: 'limel-example-dialog-action-button-conventions_placement',
    shadow: true,
    styleUrl: 'dialog-action-button-conventions.scss',
})
export class DialogActionButtonConventionsPlacementExample {
    public render() {
        return [
            <div class="dialog-action-buttons-examples">
                <div class="example">
                    <div class="fake-dialog-container">
                        <div class="fake-dialog">
                            <p>
                                Actions are located at the bottom-right corner
                            </p>
                            <limel-flex-container slot="button">
                                <limel-button label="Ok" primary={true} />
                            </limel-flex-container>
                        </div>
                    </div>
                </div>
                <div class="example">
                    <div class="fake-dialog-container">
                        <div class="fake-dialog">
                            <p>
                                Positive action is on the right side, and
                                negative on left left.
                            </p>
                            <limel-flex-container slot="button">
                                <limel-button label="Cancel" />
                                <limel-button label="Ok" primary={true} />
                            </limel-flex-container>
                        </div>
                    </div>
                </div>
            </div>,
        ];
    }
}
