import { Component, h, State } from '@stencil/core';
import { FlowItem } from '../progress-flow.types';

/**
 * Deal status Example
 *
 * An example to show a deal progress flow
 */
@Component({
    tag: 'limel-example-progress-flow-deal',
    shadow: true,
})
export class ProgressFlowDealExample {
    @State()
    private flowItems: FlowItem[] = [
        {
            value: 'contact',
            text: 'Customer contact',
            activeColor: 'rgb(var(--color-blue-default))',
            selected: true,
        },
        {
            value: 'requirement',
            text: 'Demand analysis',
            activeColor: 'rgb(var(--color-teal-default))',
        },
        {
            value: 'tender',
            text: 'Quote',
            activeColor: 'rgb(var(--color-green-default))',
        },
        {
            value: 'agreement',
            text: 'Agreement',
            activeColor: 'rgb(var(--color-green-dark))',
        },
        {
            value: 'rejection',
            text: 'Rejection',
            isEndPhase: true,
            activeColor: 'rgb(var(--color-red-dark))',
        },
        {
            value: 'onhold',
            text: 'On hold',
            isEndPhase: true,
            activeColor: 'rgb(var(--color-coral-default))',
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
