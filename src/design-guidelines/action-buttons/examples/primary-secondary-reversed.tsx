import { Component, h, Host } from '@stencil/core';

@Component({
    tag: 'limel-example-action-buttons-primary-secondary-reversed',
    shadow: true,
    styleUrl: 'action-buttons.scss',
})
export class ActionButtonsPrimarySecondaryReversedExample {
    public render() {
        return (
            <Host>
                <limel-example-do-do-not>
                    <div
                        slot="do"
                        class="fake-dialog-container shows-full-dialog"
                    >
                        <div class="fake-dialog">
                            <h4>"Johan Andersson" already exists!</h4>
                            <p>
                                A person called "Johan Andersson" is already
                                assigned to this task. Do you want to replace
                                him with another "Johan Andersson"?
                            </p>
                            <div class="action-bar">
                                <limel-button label="Cancel" primary={true} />
                                <limel-button label="Replace" />
                            </div>
                        </div>
                    </div>
                    <div
                        slot="do-not"
                        class="fake-dialog-container shows-full-dialog"
                    >
                        <div class="fake-dialog">
                            <h4>"Johan Andersson" already exists!</h4>
                            <p>
                                A person called "Johan Andersson" is already
                                assigned to this task. Do you want to replace
                                him with another "Johan Andersson"?
                            </p>
                            <div class="action-bar">
                                <limel-button label="Cancel" />
                                <limel-button label="Replace" primary={true} />
                            </div>
                        </div>
                    </div>
                </limel-example-do-do-not>
                <limel-example-do-do-not>
                    <div
                        slot="do"
                        class="fake-dialog-container shows-full-dialog"
                    >
                        <div class="fake-dialog">
                            <h4>Want to leave this conversation?</h4>
                            <p>
                                By leaving this conversation, you will no longer
                                have access to chat history, shared files, and
                                new updates.
                            </p>
                            <div class="action-bar">
                                <limel-button label="Cancel" primary={true} />
                                <limel-button label="Leave" />
                            </div>
                        </div>
                    </div>
                    <div
                        slot="do-not"
                        class="fake-dialog-container shows-full-dialog"
                    >
                        <div class="fake-dialog">
                            <h4>Want to leave this conversation?</h4>
                            <p>
                                By leaving this conversation, you will no longer
                                have access to chat history, shared files, and
                                new updates.
                            </p>
                            <div class="action-bar">
                                <limel-button label="Cancel" />
                                <limel-button label="Leave" primary={true} />
                            </div>
                        </div>
                    </div>
                </limel-example-do-do-not>
            </Host>
        );
    }
}
