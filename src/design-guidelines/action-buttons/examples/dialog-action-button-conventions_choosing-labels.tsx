import { Component, h } from '@stencil/core';

/**
 * Choosing good labels
 *
 * Labels you use should make sense together. You are usually
 * dealing with contradictory actions, thus what you put on
 * each button should also reflect the contradiction.
 */
@Component({
    tag: 'limel-example-dialog-action-button-conventions_choosing-labels',
    shadow: true,
    styleUrl: 'dialog-action-button-conventions.scss',
})
export class DialogActionButtonConventionsChoosingLabelsExample {
    public render() {
        return [
            <div class="dialog-action-buttons-examples">
                <div class="example">
                    <div class="fake-dialog-container">
                        <div class="fake-dialog">
                            <p>
                                <b>Good</b> usage of labels
                            </p>
                            <limel-flex-container slot="button">
                                <limel-button label="Discard" />
                                <limel-button label="Save" primary={true} />
                            </limel-flex-container>
                        </div>
                    </div>
                </div>
                <div class="example">
                    <div class="fake-dialog-container">
                        <div class="fake-dialog">
                            <p>
                                <b>Bad</b> usage of labels
                            </p>
                            <limel-flex-container slot="button">
                                <limel-button label="Close" />
                                <limel-button label="Save" primary={true} />
                            </limel-flex-container>
                        </div>
                    </div>
                </div>
            </div>,
        ];
    }
}
