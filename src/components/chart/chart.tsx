import { Component, h, Prop } from '@stencil/core';
import { ChartItem } from './chart.types';
import { createRandomString } from '../../util/random-string';

/**
 * A chart is a graphical representation of data, in which
 * visual symbols such as such bars, dots, lines, or slices, represent
 * each data point, in comparison to others.
 *
 * @exampleComponent limel-example-chart-stacked-bar
 * @exampleComponent limel-example-chart-orientation
 * @exampleComponent limel-example-chart-max-value
 * @exampleComponent limel-example-chart-type-bar
 * @exampleComponent limel-example-chart-type-scatter
 * @exampleComponent limel-example-chart-type-doughnut
 * @exampleComponent limel-example-chart-type-pie
 * @exampleComponent limel-example-chart-type-gantt
 * @exampleComponent limel-example-chart-multi-axis
 * @exampleComponent limel-example-chart-styling
 * @Beta
 */

@Component({
    tag: 'limel-chart',
    shadow: true,
    styleUrl: 'chart.scss',
})
export class Chart {
    /**
     * List of items in the chart,
     * each representing a data point.
     */
    @Prop()
    public items!: ChartItem[];

    /**
     * Defines how items are visualized in the chart.
     */
    @Prop({ reflect: true })
    public type: 'bar' | 'stacked-bar' | 'pie' | 'doughnut' | 'scatter' =
        'stacked-bar';

    /**
     * Defines how the bars in the chart `bar` and `stacked-bar` types
     * are stretched.
     */
    @Prop({ reflect: true })
    public orientation: 'horizontal' | 'vertical' = 'horizontal';

    /**
     * Specifies the range that items' values could be in.
     * This is used in calculation of the size of the items in the chart.
     * When not provided, the sum of all values in the items will be considered as the range.
     */
    @Prop({ reflect: true })
    public range?: number;

    /**
     *
     */
    @Prop({ reflect: true })
    public legend: boolean = true;

    public render() {
        if (!this.items || this.items.length === 0) {
            return;
        }

        const hasNegativeValues = this.items.some(
            (item) => item.value < 0 || (item.startValue || 0) < 0,
        );

        return (
            <div
                class={{
                    chart: true,
                    'has-negative-values': hasNegativeValues,
                }}
            >
                {this.renderAxises()}
                {this.renderItems()}
            </div>
        );
    }

    private renderAxises() {
        if (this.type !== 'bar' && this.type !== 'scatter') {
            return;
        }

        const { minRange, maxRange } = this.calculateRange();
        const increment = 10;
        const lines = [];

        // Adjust minRange and maxRange to the nearest multiples of increment
        const adjustedMinRange = Math.floor(minRange / increment) * increment;
        const adjustedMaxRange = Math.ceil(maxRange / increment) * increment;

        for (
            let value = adjustedMinRange;
            value <= adjustedMaxRange;
            value += increment
        ) {
            // const position = ((value - minRange) / (maxRange - minRange)) * 100;

            lines.push(
                <div
                    class={{
                        'axis-line': true,
                        'zero-line': value === 0,
                    }}
                    // style={{
                    //     [this.orientation === 'vertical' ? 'bottom' : 'left']: `${position}%`,
                    // }}
                    role="presentation"
                >
                    <span>{value}</span>
                </div>,
            );
        }

        return (
            <div class="axises" role="presentation">
                {lines}
            </div>
        );
    }

    private renderItems() {
        const { minRange, totalRange } = this.calculateRange();

        let cumulativeOffset = 0;

        return this.items.map((item) => {
            const itemId = createRandomString();

            const normalizedStart =
                (((item.startValue ?? 0) - minRange) / totalRange) * 100;
            const normalizedEnd = ((item.value - minRange) / totalRange) * 100;
            const size = normalizedEnd - normalizedStart;

            let offset = normalizedStart;

            if (this.type === 'pie' || this.type === 'doughnut') {
                offset = cumulativeOffset;
                cumulativeOffset += size;
            }

            return [
                <span
                    style={{
                        '--limel-chart-item-color': item.color,
                        '--limel-chart-item-offset': `${offset}`,
                        '--limel-chart-item-size': `${size}`,
                    }}
                    class={{
                        item: true,
                        'has-start-value': item.startValue !== undefined,
                    }}
                    id={itemId}
                    // data-item-text={item.text}
                    tabIndex={0}
                />,
                this.renderTooltip(
                    itemId,
                    item.text,
                    item.value,
                    item.prefix,
                    item.suffix,
                    size,
                    item.startValue,
                ),
            ];
        });
    }

    private renderTooltip(
        itemId: string,
        text: string,
        value: number,
        prefix: string = '',
        suffix: string = '',
        size: number,
        startValue?: number,
    ) {
        const PERCENT_DECIMAL = 2;

        const formattedValue =
            startValue !== undefined
                ? `${prefix}${startValue}${suffix} — ${prefix}${value}${suffix}`
                : `${prefix}${value}${suffix}`;

        const tooltipProps: any = {
            label: `${text}`,
            helperLabel: `${formattedValue}`,
            elementId: itemId,
        };

        if (this.type !== 'bar' && this.type !== 'scatter') {
            tooltipProps.label = `${text} (${size.toFixed(PERCENT_DECIMAL)}%)`;
        }

        return (
            <limel-tooltip
                {...tooltipProps}
                openDirection={
                    this.orientation === 'vertical' ? 'right' : 'top'
                }
            />
        );
    }

    private calculateRange() {
        const minRange = Math.min(
            ...[].concat(
                ...this.items.map((item) => [item.startValue ?? 0, item.value]),
            ),
        );
        const maxRange = Math.max(
            ...[].concat(
                ...this.items.map((item) => [item.startValue ?? 0, item.value]),
            ),
        );

        const totalRange = this.range ?? maxRange - minRange;

        return { minRange, maxRange, totalRange }; // Return all ranges
    }
}
