import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-action-button-conventions_choosing-labels',
    shadow: true,
    styleUrl: 'action-button-conventions.scss',
})
export class ActionButtonConventionsChoosingLabelsExample {
    public render() {
        return [
            <div class="dialog-action-buttons-examples">
                <div class="example">
                    <div class="fake-dialog-container">
                        <div class="fake-dialog">
                            <p>
                                <b>Good</b> usage of labels
                            </p>
                            <limel-flex-container slot="button">
                                <limel-button label="Discard" />
                                <limel-button label="Save" primary={true} />
                            </limel-flex-container>
                        </div>
                    </div>
                </div>
                <div class="example">
                    <div class="fake-dialog-container">
                        <div class="fake-dialog">
                            <p>
                                <b>Bad</b> usage of labels
                            </p>
                            <limel-flex-container slot="button">
                                <limel-button label="Close" />
                                <limel-button label="Save" primary={true} />
                            </limel-flex-container>
                        </div>
                    </div>
                </div>
            </div>,
        ];
    }
}
