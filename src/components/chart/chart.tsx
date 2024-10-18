import { Component, h, Prop, Watch } from '@stencil/core';
import { Languages } from '../date-picker/date.types';
import translate from '../../global/translations';
import { createRandomString } from '../../util/random-string';
import { ChartItem } from './chart.types';

const PERCENT = 100;
const DEFAULT_AXIS_INCREMENT = 10;

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
 * @exampleComponent limel-example-chart-type-area
 * @exampleComponent limel-example-chart-type-doughnut
 * @exampleComponent limel-example-chart-type-pie
 * @exampleComponent limel-example-chart-type-ring
 * @exampleComponent limel-example-chart-type-gantt
 * @exampleComponent limel-example-chart-multi-axis
 * @exampleComponent limel-example-chart-multi-axis-with-negative-start-values
 * @exampleComponent limel-example-chart-multi-axis-area-with-negative-start-values
 * @exampleComponent limel-example-chart-axis-increment
 * @exampleComponent limel-example-chart-styling
 * @exampleComponent limel-example-chart-accessibility
 * @Beta
 */

@Component({
    tag: 'limel-chart',
    shadow: true,
    styleUrl: 'chart.scss',
})
export class Chart {
    /**
     * Defines the language for translations.
     * Will translate the translatable strings on the components.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    /**
     * Helps users of assistive technologies to understand
     * the context of the chart, and what is being displayed.
     */
    @Prop({ reflect: true })
    public accessibleLabel?: string;

    /**
     * Helps users of assistive technologies to understand
     * what the items in the chart represent.
     */
    @Prop({ reflect: true })
    public accessibleItemsLabel?: string;

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
    public type?:
        | 'bar'
        | 'stacked-bar'
        | 'pie'
        | 'doughnut'
        | 'scatter'
        | 'ring'
        | 'area' = 'stacked-bar';

    /**
     * Defines whether the chart is intended to be displayed wide or tall.
     * Does not have any effect on chart types which generate circular forms.
     */
    @Prop({ reflect: true })
    public orientation?: 'landscape' | 'portrait' = 'landscape';

    /**
     * Specifies the range that items' values could be in.
     * This is used in calculation of the size of the items in the chart.
     * When not provided, the sum of all values in the items will be considered as the range.
     */
    @Prop({ reflect: true })
    public maxValue?: number;

    /**
     * Specifies the increment for the axis lines.
     */
    @Prop({ reflect: true })
    public axisIncrement?: number = DEFAULT_AXIS_INCREMENT;

    private rangeData: {
        minRange: number;
        maxRange: number;
        totalRange: number;
    };

    private cachedRange: {
        minRange: number;
        maxRange: number;
        totalRange: number;
    } | null = null;

    public componentWillLoad() {
        this.recalculateRangeData();
    }

    public render() {
        return (
            <table
                style={{
                    '--limel-chart-number-of-items':
                        this.items.length.toString(),
                }}
            >
                {this.renderCaption()}
                {this.renderTableHeader()}
                {this.renderAxises()}
                <tbody class="chart">{this.renderItems()}</tbody>
            </table>
        );
    }

    private renderCaption() {
        if (!this.accessibleLabel) {
            return;
        }

        return <caption>{this.accessibleLabel}</caption>;
    }

    private renderTableHeader() {
        return (
            <thead>
                <tr>
                    <th scope="col">{this.accessibleItemsLabel}</th>
                    <th scope="col">{translate.get('value', this.language)}</th>
                </tr>
            </thead>
        );
    }

    private renderAxises() {
        if (
            this.type !== 'bar' &&
            this.type !== 'scatter' &&
            this.type !== 'area'
        ) {
            return;
        }

        const { minRange, maxRange } = this.rangeData;

        const lines = [];

        const adjustedMinRange =
            Math.floor(minRange / this.axisIncrement) * this.axisIncrement;
        const adjustedMaxRange =
            Math.ceil(maxRange / this.axisIncrement) * this.axisIncrement;

        for (
            let value = adjustedMinRange;
            value <= adjustedMaxRange;
            value += this.axisIncrement
        ) {
            lines.push(
                <div
                    class={{
                        'axis-line': true,
                        'zero-line': value === 0,
                    }}
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
        if (!this.items || this.items.length === 0) {
            return;
        }

        const { minRange, totalRange } = this.rangeData;

        let cumulativeOffset = 0;

        return this.items.map((item, index) => {
            const itemId = createRandomString();
            const { size, offset } = this.calculateSizeAndOffset(
                item,
                cumulativeOffset,
            );

            if (this.type === 'pie' || this.type === 'doughnut') {
                cumulativeOffset += size;
            }

            const nextItemSize = this.getNextItemSize(
                index,
                minRange,
                totalRange,
            );
            const nextItemOffset = this.getNextItemOffset(
                index,
                cumulativeOffset,
            );

            return (
                <tr
                    style={this.getItemStyle(
                        item,
                        index,
                        size,
                        offset,
                        nextItemSize,
                        nextItemOffset,
                    )}
                    class={this.getItemClass(item)}
                    key={itemId}
                    id={itemId}
                    tabIndex={0}
                >
                    <th>{this.getItemText(item)}</th>
                    <td>{this.getFormattedValue(item)}</td>
                    {this.renderTooltip(
                        itemId,
                        this.getItemText(item),
                        item.value,
                        size,
                        item.startValue,
                        item.prefix,
                        item.suffix,
                    )}
                </tr>
            );
        });
    }

    private getNextItemSize(
        index: number,
        minRange: number,
        totalRange: number,
    ): number {
        const nextItem = this.items[index + 1];
        if (!nextItem) {
            return 0;
        }

        const nextNormalizedEnd =
            ((nextItem.value - minRange) / totalRange) * PERCENT;
        const nextNormalizedStart =
            (((nextItem.startValue ?? 0) - minRange) / totalRange) * PERCENT;

        return nextNormalizedEnd - nextNormalizedStart;
    }

    private getNextItemOffset(index: number, cumulativeOffset: number): number {
        const nextItem = this.items[index + 1];
        if (!nextItem) {
            return 0;
        }

        if (this.type === 'pie' || this.type === 'doughnut') {
            return cumulativeOffset;
        }

        const { minRange, totalRange } = this.rangeData;

        const nextNormalizedStart =
            (((nextItem.startValue ?? 0) - minRange) / totalRange) * PERCENT;

        return nextNormalizedStart;
    }

    private getItemStyle(
        item: ChartItem,
        index: number,
        size: number,
        offset: number,
        nextItemSize: number,
        nextItemOffset: number,
    ) {
        return {
            '--limel-chart-item-color': item.color,
            '--limel-chart-item-offset': `${offset}`,
            '--limel-chart-item-size': `${size}`,
            '--limel-chart-item-index': `${index}`,
            '--limel-chart-next-item-size': `${nextItemSize}`,
            '--limel-chart-next-item-offset': `${nextItemOffset}`,
        };
    }

    private getItemClass(item: ChartItem) {
        return {
            item: true,
            'has-start-value': item.startValue !== undefined,
            'has-negative-value-only': item.value < 0 && !item.startValue,
        };
    }

    private calculateSizeAndOffset(item: ChartItem, cumulativeOffset: number) {
        const { minRange, totalRange } = this.rangeData;

        const normalizedStart =
            (((item.startValue ?? 0) - minRange) / totalRange) * PERCENT;
        const normalizedEnd = ((item.value - minRange) / totalRange) * PERCENT;
        const size = normalizedEnd - normalizedStart;

        let offset = normalizedStart;
        if (this.type === 'pie' || this.type === 'doughnut') {
            offset = cumulativeOffset;
        }

        return { size: size, offset: offset };
    }

    private getFormattedValue({
        value,
        startValue,
        prefix = '',
        suffix = '',
    }: {
        value: number;
        startValue?: number;
        prefix?: string;
        suffix?: string;
    }): string {
        const noStartValue = `${prefix}${value}${suffix}`;
        const withStartValue = `${prefix}${startValue}${suffix} — ${prefix}${value}${suffix}`;

        return startValue !== undefined ? withStartValue : noStartValue;
    }

    private getItemText(item: ChartItem): string {
        return item.text;
    }

    private renderTooltip(
        itemId: string,
        text: string,
        value: number,
        size: number,
        startValue?: number,
        prefix: string = '',
        suffix: string = '',
    ) {
        const PERCENT_DECIMAL = 2;
        const formattedValue = this.getFormattedValue({
            value: value,
            startValue: startValue,
            prefix: prefix,
            suffix: suffix,
        });

        const tooltipProps: any = {
            label: text,
            helperLabel: formattedValue,
            elementId: itemId,
        };

        if (this.type !== 'bar' && this.type !== 'scatter') {
            tooltipProps.label = `${text} (${size.toFixed(PERCENT_DECIMAL)}%)`;
        }

        return (
            <limel-tooltip
                {...tooltipProps}
                openDirection={
                    this.orientation === 'portrait' ? 'right' : 'top'
                }
            />
        );
    }

    private calculateRange() {
        if (this.cachedRange) {
            return this.cachedRange;
        }

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

        const totalSum = this.items.reduce((sum, item) => sum + item.value, 0);

        let finalMaxRange = this.maxValue ?? maxRange;
        if (
            (this.type === 'pie' || this.type === 'doughnut') &&
            !this.maxValue
        ) {
            finalMaxRange = totalSum;
        }

        const visualMaxRange =
            Math.ceil(finalMaxRange / this.axisIncrement) * this.axisIncrement;
        const visualMinRange =
            Math.floor(minRange / this.axisIncrement) * this.axisIncrement;

        const totalRange = visualMaxRange - visualMinRange;

        this.cachedRange = {
            minRange: visualMinRange,
            maxRange: visualMaxRange,
            totalRange: totalRange,
        };

        return this.cachedRange;
    }

    @Watch('items')
    @Watch('axisIncrement')
    @Watch('maxValue')
    handleChange() {
        this.cachedRange = null;
        this.recalculateRangeData();
    }

    private recalculateRangeData() {
        this.rangeData = this.calculateRange();
    }
}
