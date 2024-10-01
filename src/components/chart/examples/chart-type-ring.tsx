import { Component, h, Host, State } from '@stencil/core';
import { chartItems } from './chart-items-ring';

/**
 * Ring chart
 * A ring chart is similar to a doughnut chart but used in concentric layers,
 * ideal for comparison of hierarchical data.
 *
 * It's good for:
 * - Comparing multiple parts of a whole in a layered visual layout.
 * - Displaying hierarchical data or showing nested relationships.
 *
 * :::tip
 * **Use:**
 * - When you need to show multiple data series in a single, visually appealing chart.
 * - For data with a clear hierarchy or grouping.
 *
 * **Avoid:**
 * - With too many rings, as it can become visually overwhelming.
 * - For data that needs precise comparison across series.
 * :::
 * @sourceFile chart-items-ring.ts
 */
@Component({
    tag: 'limel-example-chart-type-ring',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartTypeRingExample {
    @State()
    private maxValue = 10;

    public render() {
        const defaultMaxValue = `${this.maxValue}`;

        return (
            <Host class="row-layout">
                <limel-chart
                    items={chartItems}
                    type="ring"
                    maxValue={this.maxValue}
                />
                <limel-example-controls>
                    <limel-input-field
                        type="number"
                        label="maxValue"
                        value={defaultMaxValue}
                        onChange={this.handleMaxValueChange}
                    />
                </limel-example-controls>
            </Host>
        );
    }
    private handleMaxValueChange = (event) => {
        this.maxValue = +event.detail;
    };
}
