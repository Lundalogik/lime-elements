import { Component, h, Host } from '@stencil/core';

@Component({
    tag: 'limel-example-switch-vs-checkbox',
    shadow: true,
    styleUrl: 'switch-vs-checkbox.scss',
})
export class SwitchVsCheckboxExample {
    public render() {
        return (
            <Host>
                <limel-example-do-do-not>
                    <div slot="do-not" class="container">
                        <p>Settings</p>
                        <limel-checkbox label="Mobile data" />
                        <limel-checkbox label="Wi-Fi" />
                        <limel-checkbox label="Bluetooth" />
                    </div>
                    <div slot="do" class="container">
                        <p>Settings</p>
                        <limel-switch label="Mobile data" />
                        <limel-switch label="Wi-Fi" />
                        <limel-switch label="Bluetooth" />
                    </div>
                </limel-example-do-do-not>
                <hr />
                <limel-example-do-do-not>
                    <div slot="do-not" class="container">
                        <p>Cookie Settings</p>
                        <limel-switch label="Necessary" />
                        <limel-switch label="Functional" />
                        <limel-switch label="Session Replay" />
                        <limel-switch label="Advertising" />
                        <div class="action-bar">
                            <limel-button label="Cancel" />
                            <limel-button label="Save" primary={true} />
                        </div>
                    </div>
                    <div slot="do" class="container">
                        <p>Cookie Settings</p>
                        <limel-checkbox label="Necessary" />
                        <limel-checkbox label="Functional" />
                        <limel-checkbox label="Session Replay" />
                        <limel-checkbox label="Advertising" />
                        <div class="action-bar">
                            <limel-button label="Cancel" />
                            <limel-button label="Save" primary={true} />
                        </div>
                    </div>
                </limel-example-do-do-not>
            </Host>
        );
    }
}
