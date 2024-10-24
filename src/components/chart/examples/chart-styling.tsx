import { Component, h } from '@stencil/core';
import { chartItems } from './chart-items-multi-axis-negative-start-values';

/**
 * Styling
 *
 * @sourceFile chart-items-gantt-negative-values.ts
 */
@Component({
    tag: 'limel-example-chart-styling',
    shadow: true,
    styleUrl: 'chart-styling.scss',
})
export class ChartStackedBarExample {
    public render() {
        return [
            <h4>Stacked-bar Chart</h4>,
            <limel-chart items={chartItems} type="stacked-bar" />,
            <div role="separator" />,
            <h4>Bar Chart</h4>,
            <limel-chart items={chartItems} type="bar" />,
        ];
    }
}
