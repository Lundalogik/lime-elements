import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-action-buttons-primary-secondary',
    shadow: true,
    styleUrl: 'action-buttons.scss',
})
export class ActionButtonsPrimarySecondaryExample {
    public render() {
        return [
            <div class="action-buttons-examples">
                <div class="example">
                    <div class="fake-dialog-container">
                        <div class="fake-dialog">
                            <p>
                                The primary action which is the expected action
                                is highlighted.
                            </p>
                            <div class="action-bar">
                                <limel-button label="Cancel" />
                                <limel-button label="Continue" primary={true} />
                            </div>
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
                            <div class="action-bar">
                                <limel-button label="Don't save" />
                                <limel-button label="Save" primary={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>,
        ];
    }
}
