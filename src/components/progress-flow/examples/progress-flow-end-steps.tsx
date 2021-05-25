import { Component, h, State } from '@stencil/core';
import { FlowItem } from '../progress-flow.types';

/**
 * Example with End steps
 *
 * An example to show a flow with end steps
 */
@Component({
    tag: 'limel-example-progress-flow-end-steps',
    shadow: true,
})
export class ProgressFlowEndStepsExample {
    @State()
    private flowItems: FlowItem[] = [
        {
            value: '1',
            text: 'Step 1',
            activeColor: 'rgb(var(--color-blue-light))',
            selected: true,
        },
        {
            value: '2',
            text: 'Step 2',
            activeColor: 'rgb(var(--color-blue-default))',
        },
        {
            value: '3',
            text: 'Step 3',
            activeColor: 'rgb(var(--color-blue-dark))',
        },
        {
            value: 'success',
            text: 'Success end step',
            isEndPhase: true,
            activeColor: 'rgb(var(--color-green-default))',
        },
        {
            value: 'failed',
            text: 'Failed end step',
            isEndPhase: true,
            activeColor: 'rgb(var(--color-red-dark))',
        },
    ];

    constructor() {
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return (
            <limel-progress-flow
                flowItems={this.flowItems}
                onChange={this.onChange}
            />
        );
    }

    private onChange(event: CustomEvent<FlowItem>) {
        this.flowItems = this.flowItems.map((item) => {
            return {
                ...item,
                selected: item.value === event.detail?.value,
            };
        });
    }
}
