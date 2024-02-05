import { Component, State, h } from '@stencil/core';
/**
 * Basic example
 * The `readonly` mode of a boolean fields do not always
 * clearly communicate the meaning of the data to the end users. Similar problems
 * have existed in user interfaces forever, and it not solely limited to
 * readonly-ness of a boolean field. If you are interested in reading more
 * about these common design problems, you can check out
 * [**State-Switch Controls:** The Infamous Case of the "Mute" Button](https://www.nngroup.com/articles/state-switch-buttons/)
 *
 * In short, the reason end-users become confused is that it is not enough to
 * keep the same label for both `true` and `false` states,
 * and only rely on changing the color or the
 * shapes and visual motifs, to communicate what the field means.
 *
 * Instead, we need to use different labels to describe the state,
 * and also get some additional help from icons and colors
 * to clarify further if needed.
 */
@Component({
    tag: 'limel-example-readonly-boolean',
    shadow: true,
    styleUrl: 'readonly-boolean.scss',
})
export class ReadonlyBooleanExample {
    @State()
    private value: boolean = false;

    public render() {
        return [
            <p>Default</p>,
            <limel-readonly-boolean label="Debt" value={this.value} />,
            <hr></hr>,
            <p>Customized</p>,
            <limel-readonly-boolean
                label="Debt"
                value={this.value}
                readonlyProps={{
                    trueIcon: {
                        name: 'error',
                        color: 'rgb(var(--color-red-default))',
                        backgroundColor: 'rgb(var(--color-yellow-default))',
                    },
                    falseIcon: {
                        name: 'ok',
                        color: 'rgb(var(--color-green-default))',
                    },
                    trueLabel: 'Has debts',
                    falseLabel: 'Does not have debts',
                }}
            />,
            <limel-readonly-boolean
                label="Newsletter"
                value={this.value}
                readonlyProps={{
                    trueIcon: 'news',
                    falseIcon: {
                        name: 'cancel_subscription',
                        color: 'rgb(var(--color-orange-default))',
                    },
                    trueLabel: 'Subscribed to receive newsletters',
                    falseLabel: 'Unsubscribed from newsletters',
                }}
            />,
            <limel-readonly-boolean
                label="Quit"
                value={this.value}
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
            />,
            <limel-readonly-boolean
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
            />,
            <hr></hr>,
            <p>Used in Checkbox and Switch</p>,
            <limel-checkbox
                checked={this.value}
                readonly={true}
                label="Checkbox"
            />,
            <limel-switch value={this.value} readonly={true} label="Switch" />,
            <limel-example-controls>
                <limel-checkbox
                    checked={this.value}
                    label="Value"
                    onChange={this.setChecked}
                />
                <limel-example-value label="Current value" value={this.value} />
            </limel-example-controls>,
        ];
    }

    private setChecked = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.value = event.detail;
    };
}
