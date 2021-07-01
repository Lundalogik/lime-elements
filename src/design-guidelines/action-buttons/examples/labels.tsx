import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-action-buttons-choosing-labels',
    shadow: true,
    styleUrl: 'action-buttons.scss',
})
export class ActionButtonsChoosingLabelsExample {
    public render() {
        return [
            <div class="do-dont-container action-buttons-examples">
                <div class="do-not">
                    <limel-header
                        icon="brake_warning"
                        heading="Don't"
                    ></limel-header>
                    <div class="fake-dialog-container shows-full-dialog">
                        <div class="fake-dialog">
                            <p>
                                <b>Bad</b> usage of labels
                            </p>
                            <div class="action-bar">
                                <limel-button label="Close" />
                                <limel-button label="Save" primary={true} />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="do">
                    <limel-header icon="ok" heading="Do"></limel-header>
                    <div class="fake-dialog-container shows-full-dialog">
                        <div class="fake-dialog">
                            <p>
                                <b>Good</b> usage of labels
                            </p>
                            <div class="action-bar">
                                <limel-button label="Discard" />
                                <limel-button label="Save" primary={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>,
        ];
    }
}
