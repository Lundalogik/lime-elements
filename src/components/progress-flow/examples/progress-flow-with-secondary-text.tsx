import { Component, h, State } from '@stencil/core';
import { FlowItem } from '@limetech/lime-elements';

/**
 * Example with secondary text
 *
 * A `secondaryText` can be used to add further information to steps.
 * This could be for instance a timestamp of when a step was activated by the user
 * or an explainatory text.
 */
@Component({
    tag: 'limel-example-progress-flow-secondary-text',
    shadow: true,
})
export class ProgressFlowSecondaryTextExample {
    @State()
    private flowItems: FlowItem[] = [
        {
            value: '1',
            text: 'Todo',
            icon: 'add_ticket',
            secondaryText: 'Added: 2021-May-26',
        },
        {
            value: '2',
            text: 'Working on it',
            icon: 'outgoing_data',
            selected: true,
            secondaryText: 'Started: 2021-May-27',
        },
        { value: '3', text: 'Done', icon: 'ok' },
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
