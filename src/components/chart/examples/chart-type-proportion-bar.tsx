import { Component, h } from '@stencil/core';
import { chartItems } from './chart-items-stack';

/**
 * Proportion bar (default)
 *
 * You can simply provide a list of items to the chart component,
 * and it will visualize them the way you want. For the default
 * visualization, the component uses the `proportion-bar` `type`,
 * as this is the most compact form of data visualization.
 *
 * The only thing each item needs is a `text`, a `value`, and your
 * choice of `color`.
 *
 * A proportion bar draws all items in a single bar, where each item
 * takes up its share of the whole. It is like a `pie` chart, drawn
 * as a straight bar.
 *
 * It's good for:
 * - Showing how parts make up a whole, such as the storage used by each kind of file.
 * - Showing progress towards a total, together with `maxValue`.
 *
 * :::tip
 * **Use:**
 * - When the items add up to a meaningful total.
 * - When space is limited, since the bar can be very thin.
 *
 * **Avoid:**
 * - If precise comparisons between the items are necessary.
 * - When there are too many items, making the bar crowded.
 * :::
 *
 * :::note
 * This `type` used to be called `stacked-bar`. The old name still
 * works, but logs a warning.
 * :::
 *
 * @sourceFile chart-items-stack.ts
 */
@Component({
    tag: 'limel-example-chart-type-proportion-bar',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartProportionBarExample {
    public render() {
        return <limel-chart items={chartItems} />;
    }
}
