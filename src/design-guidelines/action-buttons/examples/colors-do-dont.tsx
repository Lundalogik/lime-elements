import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-action-buttons-colors-do-dont',
    shadow: true,
    styleUrl: 'action-buttons.scss',
})
export class ActionButtonsColorsDoDontsExample {
    public render() {
        return [
            <div class="do-dont-container action-buttons-examples">
                <div class="do">
                    <limel-header icon="ok" heading="Do"></limel-header>
                    <div class="fake-dialog-container shows-full-dialog">
                        <div class="fake-dialog">
                            <limel-header
                                icon="delete_message"
                                heading="Delete 23 items?"
                                class="delete"
                            />
                            <p>
                                You are about to delete 23 items. This is a
                                permanent action and <b>cannot be undone</b>!
                            </p>
                            <div class="action-bar">
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
                <div class="do">
                    <limel-header icon="ok" heading="Do"></limel-header>
                    <div class="fake-dialog-container shows-full-dialog">
                        <div class="fake-dialog">
                            <limel-header
                                icon="delete_message"
                                heading="Delete selected items?"
                                class="delete"
                            />
                            <p>
                                Deleted items <b>can be restored</b> from the
                                trash later at any time!
                            </p>
                            <div class="action-bar">
                                <limel-button label="Don't delete" />
                                <limel-button
                                    label="Delete"
                                    class="button primary--danger-highlighted"
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
