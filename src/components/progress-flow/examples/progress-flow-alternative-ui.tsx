import { Component, h, State } from '@stencil/core';
import { FlowItem } from '../progress-flow.types';

/**
 * Alternative UI
 *
 * You can render the component with an alternative layout which may be good for
 * some use cases. To achive this, simply add the `has-detached-steps` to the
 * component.
 *
 * Note that the `is-narrow` class does not affect this UI alternative.
 *
 */
@Component({
    tag: 'limel-example-progress-flow-alternative-ui',
    shadow: true,
})
export class ProgressFlowAlternativeUiExample {
    @State()
    private flowItems: FlowItem[] = [
        {
            value: 'contact',
            text: 'Customer contact',
            activeColor: 'rgb(var(--color-orange-default))',
            selected: true,
            icon: 'meeting',
            secondaryText: 'Via phone support',
        },
        {
            value: 'requirement',
            text: 'Demand analysis',
            activeColor: 'rgb(var(--color-sky-default))',
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
            activeColor: 'rgb(var(--color-teal-default))',
            icon: 'agreement',
        },
        {
            value: 'rejected',
            text: 'Rejected',
            isOffProgress: true,
            activeColor: 'rgb(var(--color-red-dark))',
            icon: 'do_not_disturb',
            iconColor: 'rgb(var(--color-red-dark))',
        },
        {
            value: 'onhold',
            text: 'On hold',
            isOffProgress: true,
            activeColor: 'rgb(var(--color-coral-default))',
            icon: 'circled_pause',
            iconColor: 'rgb(var(--color-coral-default))',
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
                class="has-detached-steps"
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
