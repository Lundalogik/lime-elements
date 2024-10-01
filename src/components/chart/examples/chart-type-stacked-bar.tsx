import { Component, h } from '@stencil/core';
import { chartItems } from './chart-items-stack';

/**
 * Stacked bar (default)
 *
 * You can simply provide a list of items to the chart component,
 * and it will visualize them the way you want. For the default
 * visualization, the component uses the `stacked-bar` `type`,
 * as this is the most compact form of date visualization.
 *
 * The only thing each item needs is a `text`, a `value`, and a your
 * choice of `color`.
 *
 * * A stacked bar chart builds creates a data visualization
 * by stacking multiple data series in each bar.
 *
 * It's good for:
 * - Showing the composition of categories across multiple groups.
 * - Highlighting cumulative values while breaking down individual contributions.
 *
 * :::tip
 * **Use:**
 * - When you want to show both the total and individual values in each category.
 * - For data with sub-categories or components that need visualization.
 *
 * **Avoid:**
 * - If precise individual comparisons between subcategories are necessary.
 * - When there are too many categories, making the chart crowded.
 * :::
 *
 * @sourceFile chart-items-stack.ts
 */
@Component({
    tag: 'limel-example-chart-stacked-bar',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartStackedBarExample {
    public render() {
        return <limel-chart items={chartItems} />;
    }
}
