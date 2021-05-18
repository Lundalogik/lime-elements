import { Component, h, State } from '@stencil/core';
import { FlowItem } from '../status-flow.types';

/**
 * Example with colors
 *
 * Just a few flow items with colors and a onChange-handler.
 * Open the dev-tools console to see logged changes.
 */
@Component({
    tag: 'limel-example-status-flow-colors',
    shadow: true,
})
export class StatusFlowColorsExample {
    @State()
    private flowItems: FlowItem[] = [
        {
            value: 'lime',
            text: 'Lime step',
            activeColor: 'rgb(var(--color-lime-default))',
            selected: true,
        },
        {
            value: 'purple',
            text: 'Purple step',
            activeColor: 'rgb(var(--color-purple-default))',
        },
        {
            value: 'organge',
            text: 'Orange step',
            activeColor: 'rgb(var(--color-orange-default))',
        },
        {
            value: 'red',
            text: 'Red step',
            activeColor: 'rgb(var(--color-red-default))',
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
