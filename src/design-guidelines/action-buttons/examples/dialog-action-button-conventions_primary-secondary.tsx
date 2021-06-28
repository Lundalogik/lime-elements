import { Component, h } from '@stencil/core';

/**
 * Primary versus secondary actions
 *
 * As you know, <code>limel-button</code> can have a `primary={true}` property,
 * which makes it stand out by getting the defined primary color.
 *
 * One of your action buttons is normally the primary action. That is the action
 * that you **expect** the users to take, or you **want** or **prefer** them
 * to click on. This is usually a safe action, and that is why you want to
 * promote it by highlighting it.
 */
@Component({
    tag: 'limel-example-dialog-action-button-conventions_primary-secondary',
    shadow: true,
    styleUrl: 'dialog-action-button-conventions.scss',
})
export class DialogActionButtonConventionsPrimarySecondaryExample {
    public render() {
        return [
            <div class="dialog-action-buttons-examples">
                <div class="example">
                    <div class="fake-dialog-container">
                        <div class="fake-dialog">
                            <p>
                                The primary action which is the expected action
                                is highlighted.
                            </p>
                            <limel-flex-container slot="button">
                                <limel-button label="Cancel" />
                                <limel-button label="Continue" primary={true} />
                            </limel-flex-container>
                        </div>
                    </div>
                </div>
                <div class="example">
                    <div class="fake-dialog-container">
                        <div class="fake-dialog">
                            <p>
                                The primary action which is the expected action
                                is highlighted.
                            </p>
                            <limel-flex-container slot="button">
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
