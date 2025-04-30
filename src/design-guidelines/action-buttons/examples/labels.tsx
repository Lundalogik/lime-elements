import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-action-buttons-choosing-labels',
    shadow: true,
    styleUrl: 'action-buttons.scss',
})
export class ActionButtonsChoosingLabelsExample {
    public render() {
        return (
            <limel-example-do-do-not>
                <div slot="do" class="fake-dialog-container shows-full-dialog">
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
                <div
                    slot="do-not"
                    class="fake-dialog-container shows-full-dialog"
                >
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
            </limel-example-do-do-not>
        );
    }
}
