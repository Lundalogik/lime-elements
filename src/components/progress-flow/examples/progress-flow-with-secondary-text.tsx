import { Component, h, State } from '@stencil/core';
import { FlowItem } from '../progress-flow.types';

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
            secondaryText: 'added: 2021-01-07',
        },
        {
            value: '2',
            text: 'Working on it',
            icon: 'outgoing_data',
            selected: true,
            secondaryText: 'started: 2021-01-08',
        },
        { value: '3', text: 'Done', icon: 'ok' },
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
        console.log('Item clicked', event.detail);
        this.flowItems = this.flowItems.map((item) => {
            return {
                ...item,
                selected: item.value === event.detail?.value,
            };
        });
    }
}
