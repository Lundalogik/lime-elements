import { Component, h } from '@stencil/core';
import { chartItems } from './chart-items-stack';

/**
 * The `orientation` prop
 * Using the `orientation` prop, you can change the direction of
 * the the chart. Note that the `orientation` prop
 * does not have any effect on those `type`s of visualization that
 * do not have the common `X` and `Y` axises, such as `pie` or `doughnut`.
 *
 * :::note
 * Charts are responsive and stretch inside their containers.
 * You need to set ensure that there space for them to get rendered in.
 * :::
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
