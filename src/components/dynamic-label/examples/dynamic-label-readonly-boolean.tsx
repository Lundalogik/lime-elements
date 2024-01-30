import { Component, State, h } from '@stencil/core';

/**
 * Readonly boolean
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
 *
 * :::important
 * This example shows how to setup the `limel-dynamic-label` component to
 * create a more descriptive and dynamic labels for boolean fields.
 * But please make sure to read our guidelines about
 * [Labeling boolean fields](/#/DesignGuidelines/labeling-boolean-fields.md/)
 * to understand the importance of this, and get help in choosing the right labels
 * for boolean fields.
 * :::
 */
@Component({
    tag: 'limel-example-dynamic-label-readonly-boolean',
    shadow: true,
    styleUrl: 'dynamic-label-readonly-boolean.scss',
})
export class DynamicLabelExample {
    @State()
    private value: boolean = false;

    public render() {
        return [
            <p>Default</p>,
            <limel-dynamic-label
                defaultLabel={{ text: 'Debt', icon: 'minus' }}
            />,
            <hr></hr>,
            <p>Customized</p>,
            <limel-dynamic-label
                defaultLabel={{ text: 'Debt' }}
                value={this.value}
                labels={[
                    {
                        value: true,
                        text: 'Has debts',
                        icon: {
                            name: 'error',
                            color: 'rgb(var(--color-red-default))',
                            backgroundColor: 'rgb(var(--color-yellow-default))',
                        },
                    },
                    {
                        value: false,
                        text: 'Does not have debts',
                        icon: {
                            name: 'ok',
                            color: 'rgb(var(--color-green-default))',
                        },
                    },
                ]}
            />,
            <limel-dynamic-label
                defaultLabel={{ text: 'Newsletter' }}
                value={this.value}
                labels={[
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
            />,
            <limel-dynamic-label
                defaultLabel={{ text: 'Quit' }}
                value={this.value}
                labels={[
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
            />,
            <limel-dynamic-label
                defaultLabel={{ text: 'Mute' }}
                value={this.value}
                labels={[
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
