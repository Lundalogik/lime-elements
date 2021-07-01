import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-action-buttons-third-alternative',
    shadow: true,
    styleUrl: 'action-buttons.scss',
})
export class ActionButtonsThirdAlternativeExample {
    public render() {
        return [
            <div class="action-buttons-examples">
                <div class="example">
                    <div class="fake-dialog-container shows-full-dialog">
                        <div class="fake-dialog">
                            <limel-header
                                heading="Save changes?"
                                class="is-narrow"
                            />
                            <p>
                                You have unsaved change. Do you want to save
                                them before leaving this page?
                            </p>
                            <div class="action-bar">
                                <limel-button
                                    label="Back to editing"
                                    class="button justify-left"
                                />
                                <limel-button label="Discard" slot="button" />
                                <limel-button label="Save" primary={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>,
        ];
    }
}
