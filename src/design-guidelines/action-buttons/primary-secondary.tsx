import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-action-button-conventions_primary-secondary',
    shadow: true,
    styleUrl: 'action-button-conventions.scss',
})
export class ActionButtonConventionsPrimarySecondaryExample {
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
