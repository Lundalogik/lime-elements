import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-action-buttons-placement',
    shadow: true,
    styleUrl: 'action-buttons.scss',
})
export class ActionButtonsPlacementExample {
    public render() {
        return [
            <div class="action-buttons-examples">
                <div class="example">
                    <div class="fake-dialog-container">
                        <div class="fake-dialog">
                            <p>
                                Actions are located at the bottom-right corner
                            </p>
                            <div class="action-bar">
                                <limel-button label="Ok" primary={true} />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="example">
                    <div class="fake-dialog-container">
                        <div class="fake-dialog">
                            <p>
                                Positive action is on the right side, and
                                negative on left left.
                            </p>
                            <div class="action-bar">
                                <limel-button label="Cancel" />
                                <limel-button label="Ok" primary={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>,
        ];
    }
}
