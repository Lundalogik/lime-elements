import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-action-buttons-primary-secondary-reversed-colors',
    shadow: true,
    styleUrl: 'action-buttons.scss',
})
export class ActionButtonsPrimarySecondaryReversedColorsExample {
    public render() {
        return [
            <div class="do-dont-container action-buttons-examples">
                <div class="do">
                    <limel-header icon="ok" heading="Do"></limel-header>
                    <div class="fake-dialog-container shows-full-dialog">
                        <div class="fake-dialog">
                            <h4>"Johan Andersson" already exists!</h4>
                            <p>
                                A person called "Johan Andersson" is already
                                assigned to this task. Do you want to replace
                                him with another "Johan Andersson"?
                            </p>
                            <div class="action-bar">
                                <limel-button label="Cancel" primary={true} />
                                <limel-button
                                    label="Replace"
                                    primary={true}
                                    class="button primary--danger"
                                    icon="replace"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="do">
                    <limel-header icon="ok" heading="Do"></limel-header>
                    <div class="fake-dialog-container shows-full-dialog">
                        <div class="fake-dialog">
                            <h4>Want to leave this conversation?</h4>
                            <p>
                                By leaving this conversation, you will no longer
                                have access to chat history, shared files, and
                                new updates.
                            </p>
                            <div class="action-bar">
                                <limel-button label="Cancel" primary={true} />
                                <limel-button
                                    label="Leave"
                                    primary={true}
                                    class="button primary--danger"
                                    icon="exit"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>,
        ];
    }
}
