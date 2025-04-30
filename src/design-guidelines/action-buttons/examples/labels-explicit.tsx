import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-action-buttons-choosing-explicit-labels',
    shadow: true,
    styleUrl: 'action-buttons.scss',
})
export class ActionButtonsChoosingExplicitLabelsExample {
    public render() {
        return (
            <limel-example-do-do-not>
                <div slot="do" class="fake-dialog-container shows-full-dialog">
                    <div class="fake-dialog">
                        <p>Discard this draft?</p>
                        <div class="action-bar">
                            <limel-button
                                label="Back to editing"
                                primary={true}
                            />
                            <limel-button label="Discard" />
                        </div>
                    </div>
                </div>
                <div
                    slot="do-not"
                    class="fake-dialog-container shows-full-dialog"
                >
                    <div class="fake-dialog">
                        <p>Discard this draft?</p>
                        <div class="action-bar">
                            <limel-button label="No" primary={true} />
                            <limel-button label="Yes" />
                        </div>
                    </div>
                </div>
            </limel-example-do-do-not>
        );
    }
}
