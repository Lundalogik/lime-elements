import { Component, h } from '@stencil/core';
import { chartItems } from './chart-items-stack';

/**
 * Using the `range` prop
 *
 * The `range` is used to calculate the size of each item in the chart.
 * If provided, the size of each item will be calculated as a percentage of this value.
 * For example, if `range` is set to `100`, an item with a value of `10` will occupy
 * 10% of the chart, while an item with a value of `20` will occupy 20%.
 * If `range` is set to `200` and an item has a value of `50`,
 * the item will occupy 25% of the chart.
 *
 * If `range` is not provided, the sum of all item values will be used as the maximum,
 * and the size of each item will be calculated relative to the total sum of the items.
 *
 * @sourceFile chart-stacked-bar-items.ts
 */
@Component({
    tag: 'limel-example-chart-max-value',
    shadow: true,
})
export class ChartrangeExample {
    public render() {
        return <limel-chart items={chartItems} range={512} />;
    }
}
