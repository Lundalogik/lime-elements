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
     * Specifies the maximum value used to calculate
     * the size of each item in the chart.
     * If `maxValue` is not provided, the size of items will be
     * visualized in relation to each other.
     */
    @Prop({ reflect: true })
    public maxValue?: number;

    /**
     *
     */
    @Prop({ reflect: true })
    public legend: boolean = true;

    public render() {
        if (!this.items || this.items.length === 0) {
            return;
        }

        return <div class="chart">{this.renderItems()}</div>;
    }

    private renderItems() {
        const totalValue =
            this.maxValue ||
            this.items.reduce((acc, item) => acc + item.value, 0);

        let cumulativeRotation = 0;

        return this.items.map((item) => {
            const itemId = createRandomString();

            const percentage = (item.value / totalValue) * PERCENT;
            const rotation = cumulativeRotation;
            cumulativeRotation += percentage / PERCENT;

            return [
                <span
                    class="item"
                    style={{
                        '--limel-chart-item-color': item.color,
                        '--limel-chart-item-value': `${percentage}`,
                        '--limel-chart-item-rotate': `${rotation}turn`,
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
