import { Component, h } from '@stencil/core';
import { chartItems } from './chart-items-stack';

/**
 * Using the `maxValue` prop
 *
 * For `stacked-bar`, `pie`, `doughnut`, and `ring`, `maxValue` is the
 * denominator used as the whole. An item with value `10` occupies 10% when
 * `maxValue` is `100`. The combined item size can exceed `maxValue`, producing
 * a total above 100%. Without `maxValue`, the chart uses the combined item
 * values or range extents.
 *
 * For `bar`, `dot`, `area`, and `line`, `maxValue` sets the requested upper
 * bound. The chart can round that bound up to the next `axisIncrement`. The
 * lower bound includes zero and negative item values, rounded down to the
 * previous `axisIncrement`.
 *
 * `maxValue` has no effect on `nps` or `scatter`.
 *
 * @sourceFile chart-items-stack.ts
 */
@Component({
    tag: 'limel-example-chart-max-value',
    shadow: true,
})
export class ChartMaxValueExample {
    public render() {
        return <limel-chart items={chartItems} maxValue={512} />;
    }
}
