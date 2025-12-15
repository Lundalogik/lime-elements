import { Component, State, h } from '@stencil/core';

/**
 * Basic example
 *
 * Switching the value to `true` or `false` will dynamically change the label,
 * while the default label (including its icon) is ignored.
 */
@Component({
    tag: 'limel-example-dynamic-label',
    shadow: true,
})
export class DynamicLabelExample {
    @State()
    private value: boolean = false;

    public render() {
        return [
            <limel-dynamic-label
                defaultLabel={{ text: 'Debt', icon: 'minus' }}
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
            <limel-example-controls>
                <limel-switch
                    value={this.value}
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
