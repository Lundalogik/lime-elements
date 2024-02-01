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
                                readonlyLabels={[
                                    {
                                        value: true,
                                        icon: {
                                            name: 'error',
                                            color: 'rgb(var(--color-red-default))',
                                            backgroundColor:
                                                'rgb(var(--color-yellow-default))',
                                        },
                                        text: 'Has debts',
                                    },
                                    {
                                        value: false,
                                        icon: {
                                            name: 'ok',
                                            color: 'rgb(var(--color-green-default))',
                                        },
                                        text: 'Does not have debts',
                                    },
                                ]}
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
                                readonlyLabels={[
                                    {
                                        value: true,
                                        icon: {
                                            name: 'inactive_state',
                                            color: 'rgb(var(--color-gray-default))',
                                        },
                                        text: 'Has quit their job',
                                    },
                                    {
                                        value: false,
                                        icon: {
                                            name: 'in_progress',
                                            color: 'rgb(var(--color-sky-default))',
                                        },
                                        text: 'Still works here',
                                    },
                                ]}
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
                                readonlyLabels={[
                                    {
                                        value: true,
                                        icon: 'news',
                                        text: 'Subscribed to receive newsletters',
                                    },
                                    {
                                        value: false,
                                        icon: {
                                            name: 'cancel_subscription',
                                            color: 'rgb(var(--color-orange-default))',
                                        },
                                        text: 'Unsubscribed from newsletters',
                                    },
                                ]}
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
                                readonlyLabels={[
                                    {
                                        value: true,
                                        icon: {
                                            name: 'no_microphone',
                                            color: 'rgb(var(--color-gray-light))',
                                        },
                                        text: "You're muted",
                                    },
                                    {
                                        value: false,
                                        icon: 'microphone',
                                        text: 'Microphone is active…',
                                    },
                                ]}
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
