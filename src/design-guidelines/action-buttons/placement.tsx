import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-action-button-conventions_placement',
    shadow: true,
    styleUrl: 'action-button-conventions.scss',
})
export class ActionButtonConventionsPlacementExample {
    public render() {
        return [
            <div class="dialog-action-buttons-examples">
                <div class="example">
                    <div class="fake-dialog-container">
                        <div class="fake-dialog">
                            <p>
                                Actions are located at the bottom-right corner
                            </p>
                            <limel-flex-container slot="button">
                                <limel-button label="Ok" primary={true} />
                            </limel-flex-container>
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
                            <limel-flex-container slot="button">
                                <limel-button label="Cancel" />
                                <limel-button label="Ok" primary={true} />
                            </limel-flex-container>
                        </div>
                    </div>
                </div>
            </div>,
        ];
    }
}
