import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-action-buttons-icon-color',
    shadow: true,
    styleUrl: 'action-buttons.scss',
})
export class ActionButtonsIconColorExample {
    public render() {
        return [
            <div class="action-buttons-examples">
                <div class="example">
                    <div class="fake-dialog-container shows-full-dialog">
                        <div class="fake-dialog">
                            <limel-header
                                icon="ask_question"
                                heading="Save changes?"
                                class="save"
                            />
                            <p>
                                You have unsaved changes. Do you want to save
                                them before leaving this page?
                            </p>
                            <div class="action-bar">
                                <limel-button
                                    label="Back to editing"
                                    class="button back primary--neutral justify-left"
                                    icon="left_arrow"
                                />
                                <limel-button
                                    label="Discard"
                                    class="button discard primary--caution"
                                    icon="cancel"
                                    primary={true}
                                />
                                <limel-button
                                    label="Save"
                                    class="button update"
                                    icon="ok"
                                    primary={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="example">
                    <div class="fake-dialog-container shows-full-dialog">
                        <div class="fake-dialog">
                            <limel-header
                                icon="delete_message"
                                heading="Delete selected items?"
                                class="delete"
                            />
                            <p>
                                You are about to delete 23 items. This is a
                                permanent action and cannot be undone!
                            </p>
                            <div class="action-bar">
                                <limel-button
                                    label="Back to selection"
                                    class="button primary--neutral justify-left"
                                    icon="left_arrow"
                                />
                                <limel-button
                                    label="Don't delete"
                                    class="button primary--caution"
                                    icon="cancel"
                                    primary={true}
                                />
                                <limel-button
                                    label="Delete"
                                    class="button primary--danger"
                                    icon="trash"
                                    primary={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>,
        ];
    }
}
