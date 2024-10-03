import { Component, h } from '@stencil/core';
import { chartItems } from './chart-items-stack';

/**
 * Basic example
 *
 * You can simply provide a list of items to the chart component,
 * and it will visualize them the way you want. For the default
 * visualization, the component uses the `stacked-bar` `type`,
 * as this is the most compact form of date visualization.
 *
 * The only thing each item needs is a `text`, a `value`, and a your
 * choice of `color`.
 *
 * @sourceFile chart-stacked-bar-items.ts
 */
@Component({
    tag: 'limel-example-chart-basic',
    shadow: true,
    styleUrl: 'chart-resizable-container.scss',
})
export class ChartBasicExample {
    public render() {
        return <limel-chart items={chartItems} />;
    }
}
