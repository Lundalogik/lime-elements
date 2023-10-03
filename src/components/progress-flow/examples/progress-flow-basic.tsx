import { Component, h, State } from '@stencil/core';
import { FlowItem } from '@limetech/lime-elements';

/**
 * Basic Example
 *
 * Progress flow can visualize linear process, consisting of distinct steps.
 * Sometimes, this is a great alternative to use instead of `limel-select`.
 * For instance, when there are too few options available to choose from, and
 * the options have an incremental order.
 *
 * Each step can optionally get an icon, to help users understand its meaning
 * faster, and recognize it quicker next time.
 */
@Component({
    tag: 'limel-example-progress-flow-basic',
    shadow: true,
})
export class ProgressFlowBasicExample {
    @State()
    private disabled = false;

    @State()
    private readonly = false;

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

    public render() {
        return [
            <limel-progress-flow
                flowItems={this.flowItems}
                onChange={this.handleChange}
                disabled={this.disabled}
                readonly={this.readonly}
            />,
            <limel-example-controls>
                <limel-checkbox
                    checked={this.disabled}
                    label="Disabled"
                    onChange={this.setDisabled}
                />
                <limel-checkbox
                    checked={this.readonly}
                    label="Readonly"
                    onChange={this.setReadonly}
                />
            </limel-example-controls>,
            <limel-example-value
                value={this.flowItems.find((i) => i.selected)}
            />,
        ];
    }

    private handleChange = (event: CustomEvent<FlowItem>) => {
        this.flowItems = this.flowItems.map((item) => {
            return {
                ...item,
                selected: item.value === event.detail?.value,
            };
        });
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };
}
