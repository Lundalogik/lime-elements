import { Component, h, Host } from '@stencil/core';
import {
    stackedBarChartItems,
    ganttChartItems,
    areaChartItems,
} from './chart-items-creative-styling';

/**
 * Creative styling
 *
 * Behind the scenes for some chart types,
 * the `color` property of the `item` is used as a `background` style,
 * not a `background-color` style.
 * This, together with some CSS knowledge can empower some creative visualizations;
 * specially when a solid color is not enough to communicate a certain meaning.
 * Here are some examples for inspiration.
 *
 * @sourceFile chart-items-creative-styling.ts
 */
@Component({
    tag: 'limel-example-chart-creative-styling',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartTypeCreativeStylingExample {
    public render() {
        return (
            <Host class="tall creative-styling">
                <limel-chart type="stacked-bar" items={stackedBarChartItems} />
                <limel-chart type="bar" items={ganttChartItems} />
                <limel-chart type="area" items={areaChartItems} />
            </Host>
        );
    }
}
