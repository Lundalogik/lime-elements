import { Component, State, h } from '@stencil/core';

@Component({
    tag: 'limel-example-readonly-props',
    shadow: true,
    styleUrl: 'readonly-props.scss',
})
export class ReadonlyPropsExample {
    @State()
    private value: boolean = false;

    @State()
    private readonly: boolean = true;

    public render() {
        return [
            <table>
                <thead>
                    <tr>
                        <th>Default</th>
                        <th>Customized</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <limel-checkbox
                                readonly={this.readonly}
                                label="Debt"
                                checked={this.value}
                            />
                        </td>
                        <td>
                            <limel-checkbox
                                readonly={this.readonly}
                                label="Debt"
                                checked={this.value}
                                readonlyTrueIcon={{
                                    name: 'error',
                                    color: 'rgb(var(--color-red-default))',
                                    backgroundColor:
                                        'rgb(var(--color-yellow-default))',
                                }}
                                readonlyFalseIcon={{
                                    name: 'ok',
                                    color: 'rgb(var(--color-green-default))',
                                }}
                                readonlyTrueLabel="Has debts"
                                readonlyFalseLabel="Does not have debts"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <limel-checkbox
                                readonly={this.readonly}
                                label="Quit"
                                checked={this.value}
                            />
                        </td>
                        <td>
                            <limel-checkbox
                                readonly={this.readonly}
                                label="Quit"
                                checked={this.value}
                                readonlyTrueIcon={{
                                    name: 'inactive_state',
                                    color: 'rgb(var(--color-gray-default))',
                                }}
                                readonlyFalseIcon={{
                                    name: 'in_progress',
                                    color: 'rgb(var(--color-sky-default))',
                                }}
                                readonlyTrueLabel="Has quit their job"
                                readonlyFalseLabel="Still works here"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <limel-switch
                                readonly={this.readonly}
                                label="Newsletter"
                                value={this.value}
                            />
                        </td>
                        <td>
                            <limel-switch
                                readonly={this.readonly}
                                label="Newsletter"
                                value={this.value}
                                readonlyTrueIcon="news"
                                readonlyFalseIcon={{
                                    name: 'cancel_subscription',
                                    color: 'rgb(var(--color-orange-default))',
                                }}
                                readonlyTrueLabel="Subscribed to receive newsletters"
                                readonlyFalseLabel="Unsubscribed from newsletters"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <limel-switch
                                readonly={this.readonly}
                                label="Mute"
                                value={this.value}
                            />
                        </td>
                        <td>
                            <limel-switch
                                readonly={this.readonly}
                                label="Mute"
                                value={this.value}
                                readonlyTrueIcon={{
                                    name: 'no_microphone',
                                    color: 'rgb(var(--color-gray-light))',
                                }}
                                readonlyFalseIcon="microphone"
                                readonlyTrueLabel="You're muted"
                                readonlyFalseLabel="Microphone is active…"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>,
            <limel-example-controls>
                <limel-checkbox
                    checked={this.value}
                    label="Toggle value"
                    onChange={this.setChecked}
                />
                <limel-checkbox
                    checked={this.readonly}
                    label="Toggle readonly"
                    onChange={this.setReadonly}
                />
                <limel-example-value label="Current value" value={this.value} />
            </limel-example-controls>,
        ];
    }

    private setChecked = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.value = event.detail;
    };

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };
}
