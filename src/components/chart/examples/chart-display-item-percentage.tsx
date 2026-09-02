import { Component, h, Host, State } from '@stencil/core';
import { chartItems } from './chart-items-stack';

/**
 * Hiding the percentage in tooltips
 *
 * The tooltip of an item in a `stacked-bar`, `pie`, `doughnut`, or `ring`
 * chart shows the item's share of the whole next to its `text`.
 * Set `displayItemPercentage` to `false` to show the `text` and the value alone.
 *
 * @sourceFile chart-items-stack.ts
 */
@Component({
    tag: 'limel-example-chart-display-item-percentage',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartDisplayItemPercentageExample {
    @State()
    private displayItemPercentage = false;

    public render() {
        return (
            <Host>
                <limel-chart
                    items={chartItems}
                    displayItemPercentage={this.displayItemPercentage}
                />
                <limel-example-controls>
                    <limel-switch
                        label="displayItemPercentage"
                        value={this.displayItemPercentage}
                        onChange={this.handleChange}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private readonly handleChange = (event: CustomEvent<boolean>) => {
        this.displayItemPercentage = event.detail;
    };
}
