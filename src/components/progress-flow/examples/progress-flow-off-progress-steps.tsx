import { Component, h, State } from '@stencil/core';
import { FlowItem } from '@limetech/lime-elements';

/**
 * Example with off-progress steps
 *
 * Naturally, the Progress Flow component is used to visualize a continuous linear
 * process. But sometimes such processes can be abrupted, despite the level of progress.
 *
 * Abruptions can be excluded and displayed separately (not as a part of the flow)
 * using the `isOffProgress` property.
 *
 */
@Component({
    tag: 'limel-example-progress-flow-off-progress-steps',
    shadow: true,
})
export class ProgressFlowOffProgressStepsExample {
    @State()
    private flowItems: FlowItem[] = [
        {
            value: 'contact',
            text: 'Customer contact',
            selectedColor: 'rgb(var(--color-orange-default))',
            selected: true,
            icon: 'meeting',
        },
        {
            value: 'requirement',
            text: 'Demand analysis',
            selectedColor: 'rgb(var(--color-sky-default))',
            icon: 'combo_chart',
        },
        {
            value: 'tender',
            text: 'Quote',
            selectedColor: 'rgb(var(--color-green-default))',
            icon: 'paper_plane',
        },
        {
            value: 'agreement',
            text: 'Agreement',
            selectedColor: 'rgb(var(--color-teal-default))',
            icon: 'agreement',
        },
        {
            value: 'rejected',
            text: 'Rejected',
            isOffProgress: true,
            selectedColor: 'rgb(var(--color-red-dark))',
            icon: 'do_not_disturb',
            iconColor: 'rgb(var(--color-red-dark))',
        },
        {
            value: 'onhold',
            text: 'On hold',
            isOffProgress: true,
            selectedColor: 'rgb(var(--color-coral-default))',
            icon: 'circled_pause',
            iconColor: 'rgb(var(--color-coral-default))',
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
