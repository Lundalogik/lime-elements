import { Component, h } from '@stencil/core';

/**
 * Providing a third alternative action
 *
 * Sometimes having two action is not enough for the user to
 * take a decision. A common scenario is when a user has
 * unsaved changes and tries to navigate away from the view. In
 * such cases, typically a prompt maybe be shown, to alert
 * users about consequences of their action, and give them a few logical choices.
 *
 * In such a case, you can offer two main actions of "Save (and
 * third choice that allows users to "Cancel (and go back / not continue!)".
 */
@Component({
    tag: 'limel-example-dialog-action-button-conventions_third-alternative',
    shadow: true,
    styleUrl: 'dialog-action-button-conventions.scss',
})
export class DialogActionButtonConventionsThirdAlternativeExample {
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
                                    class="button justify-left"
                                />
                                <limel-button label="Discard" />
                                <limel-button label="Save" primary={true} />
                            </limel-flex-container>
                        </div>
                    </div>
                </div>
            </div>,
        ];
    }
}
