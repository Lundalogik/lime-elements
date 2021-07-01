import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-action-buttons-choosing-explicit-labels',
    shadow: true,
    styleUrl: 'action-buttons.scss',
})
export class ActionButtonsChoosingExplicitLabelsExample {
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
                            <p>Discard this draft?</p>
                            <div class="action-bar">
                                <limel-button label="No" primary={true} />
                                <limel-button label="Yes" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="do">
                    <limel-header icon="ok" heading="Do"></limel-header>
                    <div class="fake-dialog-container shows-full-dialog">
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
                </div>
            </div>,
        ];
    }
}
