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
            icon: 'meeting',
        },
        {
            value: 'requirement',
            text: 'Demand analysis',
            activeColor: 'rgb(var(--color-teal-default))',
            icon: 'combo_chart',
        },
        {
            value: 'tender',
            text: 'Quote',
            activeColor: 'rgb(var(--color-green-default))',
            icon: 'paper_plane',
        },
        {
            value: 'agreement',
            text: 'Agreement',
            activeColor: 'rgb(var(--color-green-dark))',
            icon: 'agreement',
        },
        {
            value: 'rejected',
            text: 'Rejected',
            isEndPhase: true,
            activeColor: 'rgb(var(--color-red-dark))',
            icon: 'cancel_2',
        },
        {
            value: 'onhold',
            text: 'On hold',
            isEndPhase: true,
            activeColor: 'rgb(var(--color-coral-default))',
            icon: 'circled_pause',
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
