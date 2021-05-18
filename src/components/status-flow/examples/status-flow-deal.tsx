import { Component, h, State } from '@stencil/core';
import { FlowItem } from '../status-flow.types';

/**
 * Deal status Example
 *
 * An example to show a deal status flow
 */
@Component({
    tag: 'limel-example-status-flow-deal',
    shadow: true,
})
export class StatusFlowDealExample {
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
            <limel-flex-container>
                <limel-status-flow
                    flowItems={this.flowItems}
                    onChange={this.onChange}
                />
            </limel-flex-container>
        );
    }

    private onChange(event: CustomEvent<FlowItem>) {
        console.log('Item clicked', event.detail);
        this.flowItems = this.flowItems.map((item) => {
            return {
                ...item,
                selected: item.value === event.detail?.value,
            };
        });
    }
}
