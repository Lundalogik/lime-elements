import { Component, h, Prop } from '@stencil/core';
import { ChartItem } from './chart.types';
import { createRandomString } from '../../util/random-string';
const PERCENT = 100;

/**
 * A chart is a graphical representation of data, in which
 * visual symbols such as such bars, dots, lines, or slices, represent
 * each data point, in comparison to others.
 *
 * @exampleComponent limel-example-chart-basic
 * @exampleComponent limel-example-chart-max-value
 * @exampleComponent limel-example-chart-orientation
 * @exampleComponent limel-example-chart-type-bar
 * @exampleComponent limel-example-chart-type-scatter
 * @exampleComponent limel-example-chart-type-doughnut
 * @exampleComponent limel-example-chart-type-pie
 * @exampleComponent limel-example-chart-type-gantt
 * @exampleComponent limel-example-chart-multi-axis
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
    public type:
        | 'bar'
        | 'gantt'
        | 'stacked-bar'
        | 'pie'
        | 'doughnut'
        | 'scatter' = 'stacked-bar';

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
                {this.renderItems()}
            </div>
        );
    }

    private renderItems() {
        const sumOfAllValues = this.items.reduce(
            (acc, item) => acc + item.value,
            0,
        );
        const totalRange = this.range || sumOfAllValues || 1;

        let cumulativeRotation = 0;

        return this.items.map((item) => {
            const itemId = createRandomString();

            let startValue: number = item.startValue ?? 0;
            const percentage =
                ((item.value - startValue) / totalRange) * PERCENT;

            if (this.type === 'pie' || this.type === 'doughnut') {
                startValue = cumulativeRotation;
                cumulativeRotation += percentage / PERCENT;
            } else {
                startValue = item.startValue || 0;
            }

            return [
                <span
                    class="item"
                    style={{
                        '--limel-chart-item-color': item.color,
                        '--limel-chart-item-start-value': `${startValue}`,
                        '--limel-chart-item-end-value': `${item.value}`,
                        '--limel-chart-item-size': `${percentage}`,
                    }}
                    id={itemId}
                    data-item-text={item.text}
                    tabIndex={0}
                />,
                this.renderTooltip(
                    itemId,
                    item.text,
                    item.value,
                    item.prefix,
                    item.suffix,
                    percentage,
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
        percentage: number,
    ) {
        const PERCENT_DECIMAL = 2;

        const formattedValue = `${prefix}${value}${suffix}`;

        const tooltipProps: any = {
            label: `${text}`,
            helperLabel: `${formattedValue}`,
            elementId: itemId,
        };

        if (this.type !== 'bar' && this.type !== 'scatter') {
            tooltipProps.label = `${text} (${percentage.toFixed(PERCENT_DECIMAL)}%)`;
        }

        return <limel-tooltip {...tooltipProps} />;
    }
}
