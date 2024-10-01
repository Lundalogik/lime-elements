import { Component, h } from '@stencil/core';
import { chartItems } from './chart-items-negative-values';

/**
 * Styling
 *
 * @sourceFile chart-stacked-bar-items.ts
 */
@Component({
    tag: 'limel-example-chart-styling',
    shadow: true,
    styleUrl: 'chart-styling.scss',
})
export class ChartStackedBarExample {
    public render() {
        return [
            <limel-chart items={chartItems} type="stacked-bar" />,
            <hr />,
            <limel-chart items={chartItems} type="bar" />,
        ];
    }
}
