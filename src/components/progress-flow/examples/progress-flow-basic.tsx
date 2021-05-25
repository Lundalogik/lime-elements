import { Component, h, State } from '@stencil/core';
import { FlowItem } from '../progress-flow.types';

/**
 * Basic Example
 *
 * Just a few flow items and a onChange-handler.
 * Open the dev-tools console to see logged changes.
 */
@Component({
    tag: 'limel-example-progress-flow-basic',
    shadow: true,
})
export class ProgressFlowBasicExample {
    @State()
    private flowItems: FlowItem[] = [
        {
            value: '1',
            text: 'Step 1',
            selected: true,
            icon: 'add_shopping_cart',
        },
        { value: '2', text: 'Step 2', icon: 'shopping_cart_loaded' },
        { value: '3', text: 'Step 3', icon: 'insert_money_euro' },
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
