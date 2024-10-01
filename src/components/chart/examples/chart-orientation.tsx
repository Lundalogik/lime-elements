import { Component, h } from '@stencil/core';
import { chartItems } from './chart-stacked-bar-items';

/**
 * The `orientation` prop
 * explain how it works
 *
 * also explain width and and height
 *
 * @sourceFile chart-stacked-bar-items.ts
 */
@Component({
    tag: 'limel-example-chart-orientation',
    shadow: true,
})
export class ChartOrientationExample {
    public render() {
        return (
            <limel-chart
                style={{ width: '1rem', height: '15rem' }}
                items={chartItems}
                orientation="vertical"
                maxValue={512}
            />
        );
    }
}
