import { Component, h, Host, State } from '@stencil/core';
import { chartItems } from './chart-items-pie';

/**
 * Pie chart
 * A pie chart represents data as slices of a circle, with each slice’s size proportional to its value.
 *
 * It's good for:
 * - Showing the proportions of a whole.
 * - Visualizing data composition for easy understanding.
 *
 * :::tip
 * **Use:**
 * - When you have a limited number of categories (at least 3, and maximum ~10).
 * - For static data composition, not suitable for showing time trends.
 *
 * **Avoid:**
 * - When precise comparisons are needed, as bars provide clearer detail.
 * - With complex or large datasets where slices become too small to read.
 * :::
 *
 * @sourceFile chart-items-pie.ts
 */
@Component({
    tag: 'limel-example-chart-type-pie',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartTypePieExample {
    @State()
    private maxValue = 300;

    public render() {
        const defaultMaxValue = `${this.maxValue}`;

        return (
            <Host class="row-layout">
                <limel-chart
                    items={chartItems}
                    type="pie"
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
