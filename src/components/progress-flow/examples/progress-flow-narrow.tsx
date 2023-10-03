import { Component, h, State } from '@stencil/core';
import { FlowItem } from '@limetech/lime-elements';

/**
 * Compact layout
 *
 * For cases where this component needs to take as little space as possible,
 * we offer an alternative layout. All you need to do is addin the `is-narrow`
 * class to the component.
 */
@Component({
    tag: 'limel-example-progress-flow-narrow',
    shadow: true,
})
export class ProgressNarrowExample {
    @State()
    private flowItems: FlowItem[] = [
        {
            value: 'first',
            text: 'First step',
            selected: true,
        },
        {
            value: 'second',
            text: 'Second step',
        },
        {
            value: 'third',
            text: 'Third step',
        },
        {
            value: 'fourth',
            text: 'Fourth step',
            icon: 'finish_flag',
        },
    ];

    public render() {
        return (
            <limel-progress-flow
                flowItems={this.flowItems}
                onChange={this.handleChange}
                class="is-narrow"
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
