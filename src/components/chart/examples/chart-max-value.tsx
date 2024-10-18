import { Component, h } from '@stencil/core';
import { chartItems } from './chart-items-stack';

/**
 * Using the `maxValue` prop
 *
 * The `maxValue` prop defines the upper limit of the visual range for the chart.
 * It determines the maximum value represented on the axis and is used to
 * calculate the size of each item in the chart relative to this value.
 *
 * For example, if `maxValue` is set to `100`, an item with a value of `10`
 * will occupy 10% of the chart, while an item with a value of `50` will occupy 50%.
 * If `maxValue` is set to `200`, an item with a value of `50` will occupy 25% of the chart.
 *
 * If `maxValue` is not provided, the chart will calculate the maximum value based on
 * the actual data points, and the size of each item will be calculated relative to
 * the total range of the data.
 *
 * Note: The `maxValue` only affects the upper limit of the chart's range.
 * The chart will always start from the smallest value present in the dataset,
 * which could be a negative number.
 *
 * @sourceFile chart-items-stack.ts
 */
@Component({
    tag: 'limel-example-chart-max-value',
    shadow: true,
})
export class ChartMaxValueExample {
    public render() {
        return <limel-chart items={chartItems} maxValue={512} />;
    }
}
