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
 * When neither the container nor the chart's own styles give it a
 * height, a `bar`, `dot`, `line`, `area` or `scatter` chart is half as
 * tall as it is wide, and a `pie`, `doughnut`, `ring` or `nps` chart is
 * square. A `proportion-bar` is always at least `0.5rem` thick.
 * :::
 * @sourceFile chart-items-stack.ts
 */
@Component({
    tag: 'limel-example-chart-orientation',
    shadow: true,
})
export class ChartOrientationExample {
    public render() {
        return (
            <limel-chart
                style={{ width: '0.5rem', height: '15rem' }}
                items={chartItems}
                orientation="portrait"
            />
        );
    }
}
