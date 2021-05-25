import { Component, h, State } from '@stencil/core';
import { FlowItem } from '../progress-flow.types';

/**
 * Example with colors
 *
 * Just a few flow items with colors and a onChange-handler.
 * Open the dev-tools console to see logged changes.
 */
@Component({
    tag: 'limel-example-progress-flow-colors',
    shadow: true,
})
export class ProgressFlowColorsExample {
    @State()
    private flowItems: FlowItem[] = [
        {
            value: 'lime',
            text: 'Magenta step',
            activeColor: 'rgb(var(--color-magenta-default)',
            passedColor: 'rgb(var(--color-glaucous-dark))',
            selected: true,
        },
        {
            value: 'purple',
            text: 'Purple step',
            activeColor: 'rgb(var(--color-purple-default))',
            passedColor: 'rgb(var(--color-glaucous-dark))',
        },
        {
            value: 'organge',
            text: 'Blue step',
            activeColor: 'rgb(var(--color-blue-default))',
        },
        {
            value: 'red',
            text: 'Green step',
            activeColor: 'rgb(var(--color-green-default))',
        },
    ];

    constructor() {
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return (
            <limel-flex-container>
                <limel-progress-flow
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
