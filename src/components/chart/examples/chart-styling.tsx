import { Component, h, Host } from '@stencil/core';
import { chartItems } from './chart-items-ring';

/**
 * Styling
 * The component provides a few styling options, using CSS custom properties.
 *
 * @sourceFile chart-items-gantt-negative-values.ts
 */
@Component({
    tag: 'limel-example-chart-styling',
    shadow: true,
    styleUrl: 'chart-styling.scss',
})
export class ChartStylingExample {
    public render() {
        return (
            <Host>
                <h4>Proportion-bar Chart</h4>
                <limel-chart items={chartItems} type="proportion-bar" />
                <div role="separator" />
                <h4>Bar Chart</h4>
                <limel-chart items={chartItems} axisIncrement={1} type="bar" />
            </Host>
        );
    }
}
