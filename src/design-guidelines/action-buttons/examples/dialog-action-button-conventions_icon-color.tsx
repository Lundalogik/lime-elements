import { Component, h } from '@stencil/core';

/**
 * Adding more meaning with colors and icons
 *
 * To make it easer for the users to understand the message and take a decision
 * faster you can use icons and colors on the buttons.
 *
 * Learn more about [usage of colors](#/DesignGuidelines/color-system.md/),
 * and [how to color limel-buttons](#/component/limel-button/).
 */
@Component({
    tag: 'limel-example-dialog-action-button-conventions_icon-color',
    shadow: true,
    styleUrl: 'dialog-action-button-conventions_icon-color.scss',
})
export class DialogActionButtonConventionsIconColorExample {
    public render() {
        return [
            <div class="dialog-action-buttons-examples">
                <div class="example">
                    <div class="fake-dialog-container">
                        <div class="fake-dialog">
                            <h4>Save changes?</h4>
                            <p>
                                You have unsaved change. Do you want to save
                                them before leaving this page?
                            </p>
                            <limel-flex-container slot="button">
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
                            </limel-flex-container>
                        </div>
                    </div>
                </div>
                <div class="example">
                    <div class="fake-dialog-container">
                        <div class="fake-dialog">
                            <h4>Delete selected items?</h4>
                            <p>
                                You are about to delete 23 items. This is a
                                permanent action and cannot be undone!
                            </p>
                            <limel-flex-container slot="button">
                                <limel-button
                                    label="Back to selection"
                                    class="button primary--neutral justify-left"
                                    icon="left_arrow"
                                />
                                <limel-button
                                    label="Cancel"
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
                            </limel-flex-container>
                        </div>
                    </div>
                </div>
            </div>,
        ];
    }
}
