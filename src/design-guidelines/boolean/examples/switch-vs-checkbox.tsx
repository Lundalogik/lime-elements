import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-switch-vs-checkbox',
    shadow: true,
    styleUrl: 'switch-vs-checkbox.scss',
})
export class SwitchVsCheckboxExample {
    public render() {
        return [
            <div class="do-dont-container">
                <div class="do-not">
                    <limel-header icon="brake_warning" heading="Don't" />
                    <div class="container">
                        <p>Settings</p>
                        <limel-checkbox label="Mobile data" />
                        <limel-checkbox label="Wi-Fi" />
                        <limel-checkbox label="Bluetooth" />
                    </div>
                </div>
                <div class="do">
                    <limel-header icon="ok" heading="Do" />
                    <div class="container">
                        <p>Settings</p>
                        <limel-switch label="Mobile data" />
                        <limel-switch label="Wi-Fi" />
                        <limel-switch label="Bluetooth" />
                    </div>
                </div>
            </div>,
            <hr />,
            <div class="do-dont-container">
                <div class="do-not">
                    <limel-header icon="brake_warning" heading="Don't" />
                    <div class="container">
                        <p>Cookie Settings</p>
                        <limel-switch label="Necessary" />
                        <limel-switch label="Functional" />
                        <limel-switch label="Session Replay" />
                        <limel-switch label="Advertising" />
                    </div>
                    <div class="action-bar">
                        <limel-button label="Cancel" />
                        <limel-button label="Save" primary={true} />
                    </div>
                </div>
                <div class="do">
                    <limel-header icon="ok" heading="Do" />
                    <div class="container">
                        <p>Cookie Settings</p>
                        <limel-checkbox label="Necessary" />
                        <limel-checkbox label="Functional" />
                        <limel-checkbox label="Session Replay" />
                        <limel-checkbox label="Advertising" />
                    </div>
                    <div class="action-bar">
                        <limel-button label="Cancel" />
                        <limel-button label="Save" primary={true} />
                    </div>
                </div>
            </div>,
        ];
    }
}
