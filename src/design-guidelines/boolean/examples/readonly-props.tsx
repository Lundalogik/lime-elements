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
                                readonlyProps={{
                                    trueIcon: {
                                        name: 'error',
                                        color: 'rgb(var(--color-red-default))',
                                        backgroundColor:
                                            'rgb(var(--color-yellow-default))',
                                    },
                                    falseIcon: {
                                        name: 'ok',
                                        color: 'rgb(var(--color-green-default))',
                                    },
                                    trueLabel: 'Has debts',
                                    falseLabel: 'Does not have debts',
                                }}
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
                                readonlyProps={{
                                    trueIcon: {
                                        name: 'inactive_state',
                                        color: 'rgb(var(--color-gray-default))',
                                    },
                                    falseIcon: {
                                        name: 'in_progress',
                                        color: 'rgb(var(--color-sky-default))',
                                    },
                                    trueLabel: 'Has quit their job',
                                    falseLabel: 'Still works here',
                                }}
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
                                readonlyProps={{
                                    trueIcon: 'news',
                                    falseIcon: {
                                        name: 'cancel_subscription',
                                        color: 'rgb(var(--color-orange-default))',
                                    },
                                    trueLabel:
                                        'Subscribed to receive newsletters',
                                    falseLabel: 'Unsubscribed from newsletters',
                                }}
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
                                readonlyProps={{
                                    trueIcon: {
                                        name: 'no_microphone',
                                        color: 'rgb(var(--color-gray-light))',
                                    },
                                    falseIcon: 'microphone',
                                    trueLabel: "You're muted",
                                    falseLabel: 'Microphone is active…',
                                }}
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
