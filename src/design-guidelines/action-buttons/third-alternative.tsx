import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-action-button-conventions_third-alternative',
    shadow: true,
    styleUrl: 'action-button-conventions.scss',
})
export class ActionButtonConventionsThirdAlternativeExample {
    public render() {
        return [
            <div class="dialog-action-buttons-examples">
                <div class="example">
                    <div class="fake-dialog-container">
                        <div class="fake-dialog">
                            <h4>Save changes?</h4>
                            <p>
                                You have unsaved change. Do you want to save
                                them before leaving this page?
                            </p>
                            <limel-flex-container slot="button">
                                <limel-button
                                    label="Back to editing"
                                    class="button justify-left"
                                />
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
