import { Component, h, Host, State } from '@stencil/core';
import { chartItems } from './chart-items-pie';

/**
 * Doughnut chart
 * A doughnut chart is a variation of the pie chart, with a center space,
 * often used to show multiple concentric data series.
 *
 * It's good for:
 * - Showing proportions with a visually balanced layout.
 * - Allowing room in the center for additional information (e.g., displaying totals).
 *
 * :::tip
 * **Use:**
 * - When visual space is limited, and a pie chart may look crowded.
 * - When you have a limited number of categories (at least 3, and maximum ~10).
 * - For static data composition, not suitable for showing time trends.
 *
 * **Avoid:**
 * - When precise comparisons are needed, as bars provide clearer detail.
 * - With complex or large datasets where slices become too small to read.
 * :::
 * @sourceFile chart-items-pie.ts
 */
@Component({
    tag: 'limel-example-chart-type-doughnut',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartTypeDoughnutExample {
    @State()
    private maxValue = 140;

    public render() {
        const defaultMaxValue = `${this.maxValue}`;

        return (
            <Host class="row-layout">
                <limel-chart
                    items={chartItems}
                    type="doughnut"
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
