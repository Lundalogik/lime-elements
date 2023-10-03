import { Component, h, State } from '@stencil/core';
import { FlowItem } from '@limetech/lime-elements';

/**
 * Disabled steps
 *
 * While the entire component can be `disabled`,
 * each step can also be `disabled` individually.
 * This enables you to ask users to provide required data to be able to continue.
 */
@Component({
    tag: 'limel-example-progress-flow-disabled-step',
    shadow: true,
})
export class ProgressFlowDisabledStepExample {
    @State()
    private flowItems: FlowItem[] = [
        {
            value: '1',
            text: 'Choose a user name',
        },
        {
            value: '2',
            text: 'Choose a password',
            selected: true,
        },
        {
            value: '3',
            text: 'Enable 2-factor authentication',
            disabled: true,
        },
        {
            value: '4',
            text: "Let's go!",
            disabled: true,
        },
    ];

    public render() {
        return (
            <limel-progress-flow
                flowItems={this.flowItems}
                onChange={this.handleChange}
            />
        );
    }

    private handleChange = (event: CustomEvent<FlowItem>) => {
        this.flowItems = this.flowItems.map((item) => {
            return {
                ...item,
                selected: item.value === event.detail?.value,
            };
        });
    };
}
