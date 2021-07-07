import { Component, h, State } from '@stencil/core';
import { FlowItem } from '../progress-flow.types';

/**
 * Customizing colors further, using CSS
 *
 * A few CSS variables can be used to customize the look and feel of the steps.
 * But keep in mind that it is not possible to target steps individually and
 * change their colors, using these CSS variables. They apply globally to the
 * entire component.
 * :::note
 * Make sure that:
 * - text has enough contrast with its background and is readable.
 * - the `--progress-flow-step-divider-color` has the same color as the component's
 * container.
 * :::
 */
@Component({
    tag: 'limel-example-progress-flow-colors-css',
    shadow: true,
    styleUrl: 'progress-flow-colors-css.scss',
})
export class ProgressFlowColorsCssExample {
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
