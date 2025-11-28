import { Component, Event, EventEmitter, h, Prop, Watch } from '@stencil/core';
import { Languages } from '../date-picker/date.types';
import translate from '../../global/translations';
import { createRandomString } from '../../util/random-string';
import { ChartItem } from './chart.types';

const PERCENT = 100;
const DEFAULT_INCREMENT_SIZE = 10;

/**
 * A chart is a graphical representation of data, in which
 * visual symbols such as such bars, dots, lines, or slices, represent
 * each data point, in comparison to others.
 *
 * @exampleComponent limel-example-chart-stacked-bar
 * @exampleComponent limel-example-chart-orientation
 * @exampleComponent limel-example-chart-max-value
 * @exampleComponent limel-example-chart-type-bar
 * @exampleComponent limel-example-chart-column-titles
 * @exampleComponent limel-example-chart-type-dot
 * @exampleComponent limel-example-chart-type-area
 * @exampleComponent limel-example-chart-type-line
 * @exampleComponent limel-example-chart-type-pie
 * @exampleComponent limel-example-chart-type-doughnut
 * @exampleComponent limel-example-chart-type-ring
 * @exampleComponent limel-example-chart-type-gantt
 * @exampleComponent limel-example-chart-type-nps
 * @exampleComponent limel-example-chart-multi-axis
 * @exampleComponent limel-example-chart-multi-axis-with-negative-start-values
 * @exampleComponent limel-example-chart-multi-axis-area-with-negative-start-values
 * @exampleComponent limel-example-chart-axis-increment
 * @exampleComponent limel-example-chart-clickable-items
 * @exampleComponent limel-example-chart-accessibility
 * @exampleComponent limel-example-chart-styling
 * @exampleComponent limel-example-chart-creative-styling
 * @beta
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
        | 'area'
        | 'bar'
        | 'doughnut'
        | 'line'
        | 'nps'
        | 'pie'
        | 'ring'
        | 'dot'
        | 'stacked-bar' = 'stacked-bar';

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
    public axisIncrement?: number;

    /**
     * Indicates whether the chart is in a loading state.
     */
    @Prop({ reflect: true })
    public loading: boolean = false;

    /**
     * When set to `true`, displays column titles for bar charts.
     * By default, column titles are not rendered.
     */
    @Prop({ reflect: true })
    public showColumnTitles: boolean = false;

    /**
     * Label for the horizontal axis (X-axis).
     */
    @Prop({ reflect: true })
    public xAxisLabel?: string;

    private range: {
        minValue: number;
        maxValue: number;
        totalRange: number;
    };

    /**
     * Fired when a chart item with `clickable` set to `true` is clicked
     */
    @Event()
    public interact: EventEmitter<ChartItem>;

    public componentWillLoad() {
        this.recalculateRangeData();
    }

    public render() {
        if (this.loading) {
            return <limel-spinner limeBranded={false} />;
        }

        return [
            <table
                aria-busy={this.loading ? 'true' : 'false'}
                aria-live="polite"
                style={{
                    '--limel-chart-number-of-items':
                        this.items.length.toString(),
                }}
            >
                {this.renderCaption()}
                {this.renderTableHeader()}
                {this.renderAxises()}
                <tbody class="chart">{this.renderItems()}</tbody>
            </table>,
            this.renderXAxisLabel(),
        ];
    }

    private renderXAxisLabel() {
        if (!this.xAxisLabel) {
            return;
        }

        return <div>{this.xAxisLabel}</div>;
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
        if (!['bar', 'dot', 'area', 'line'].includes(this.type)) {
            return;
        }

        const { minValue, maxValue } = this.range;
        const lines = [];
        const adjustedMinRange =
            Math.floor(minValue / this.axisIncrement) * this.axisIncrement;
        const adjustedMaxRange =
            Math.ceil(maxValue / this.axisIncrement) * this.axisIncrement;

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
                    <limel-badge label={value} />
                </div>
            );
        }

        return (
            <div class="axises" role="presentation">
                {lines}
            </div>
        );
    }

    private renderItems() {
        if (!this.items?.length) {
            return;
        }

        let cumulativeOffset = 0;

        return this.items.map((item, index) => {
            const itemId = createRandomString();
            const sizeAndOffset = this.calculateSizeAndOffset(item);
            const size = sizeAndOffset.size;
            let offset = sizeAndOffset.offset;

            if (this.type === 'pie' || this.type === 'doughnut') {
                offset = cumulativeOffset;
                cumulativeOffset += size;
            }

            return (
                <tr
                    style={this.getItemStyle(item, index, size, offset)}
                    class={this.getItemClass(item)}
                    key={itemId}
                    id={itemId}
                    data-index={index}
                    tabIndex={0}
                    role={item.clickable ? 'button' : null}
                    onClick={this.handleClick}
                    onKeyDown={this.handleKeyDown}
                >
                    <th>{this.getItemText(item)}</th>
                    <td>{this.getFormattedValue(item)}</td>
                    {this.renderItemLabel(item, itemId, size)}
                </tr>
            );
        });
    }

    private getItemStyle(
        item: ChartItem,
        index: number,
        size: number,
        offset: number
    ): Record<string, string> {
        const style: Record<string, string> = {
            '--limel-chart-item-offset': `${offset}`,
            '--limel-chart-item-size': `${size}`,
            '--limel-chart-item-index': `${index}`,
            '--limel-chart-item-value': `${item.value}`,
        };

        if (item.color) {
            style['--limel-chart-item-color'] = item.color;
        }

        if (this.type === 'line' || this.type === 'area') {
            const nextItem = this.calculateSizeAndOffset(this.items[index + 1]);

            style['--limel-chart-next-item-size'] = `${nextItem.size}`;
            style['--limel-chart-next-item-offset'] = `${nextItem.offset}`;
        }

        return style;
    }

    private getItemClass(item: ChartItem) {
        return {
            item: true,
            'has-start-value': Array.isArray(item.value),
            'has-negative-value-only':
                this.getMaximumValue(item) < 0 && !this.isRangeItem(item),
        };
    }

    private calculateSizeAndOffset(item?: ChartItem) {
        const { minValue, totalRange } = this.range;
        if (!item) {
            return {
                size: 0,
                offset: 0,
            };
        }

        let startValue = 0;
        if (this.isRangeItem(item)) {
            startValue = this.getMinimumValue(item);
        }

        const normalizedStart =
            ((startValue - minValue) / totalRange) * PERCENT;
        const normalizedEnd =
            ((this.getMaximumValue(item) - minValue) / totalRange) * PERCENT;

        return {
            size: normalizedEnd - normalizedStart,
            offset: normalizedStart,
        };
    }

    private getFormattedValue(item: ChartItem): string {
        const { value, formattedValue } = item;

        if (formattedValue) {
            return formattedValue;
        }

        if (Array.isArray(value)) {
            return `${value[0]} — ${value[1]}`;
        }

        return `${value}`;
    }

    private getItemText(item: ChartItem): string {
        return item.text;
    }

    private renderItemLabel(item: ChartItem, itemId: string, size: number) {
        const text = this.getItemText(item);
        const PERCENT_DECIMAL = 2;
        const formattedValue = this.getFormattedValue(item);

        const tooltipProps: any = {
            label: text,
            helperLabel: formattedValue,
            elementId: itemId,
        };

        if (this.type !== 'bar' && this.type !== 'dot' && this.type !== 'nps') {
            tooltipProps.label = `${text} (${size.toFixed(PERCENT_DECIMAL)}%)`;
        }

        const tooltip = (
            <limel-tooltip
                {...tooltipProps}
                openDirection={
                    this.orientation === 'portrait' ? 'right' : 'top'
                }
            />
        );

        if (
            this.showColumnTitles &&
            this.orientation === 'landscape' &&
            this.type === 'bar'
        ) {
            return [<div class="column-title">{text}</div>, tooltip];
        }

        return tooltip;
    }

    private calculateRange() {
        if (this.range) {
            return this.range;
        }

        const minRange = Math.min(0, ...this.items.map(this.getMinimumValue));
        const maxRange = Math.max(...this.items.map(this.getMaximumValue));
        const totalSum = this.items.reduce(
            (sum, item) => sum + this.getMaximumValue(item),
            0
        );

        let finalMaxRange = this.maxValue ?? maxRange;
        if (
            (this.type === 'pie' || this.type === 'doughnut') &&
            !this.maxValue
        ) {
            finalMaxRange = totalSum;
        }

        if (!this.axisIncrement) {
            this.axisIncrement = this.calculateAxisIncrement(this.items);
        }

        const visualMaxValue =
            Math.ceil(finalMaxRange / this.axisIncrement) * this.axisIncrement;
        const visualMinValue =
            Math.floor(minRange / this.axisIncrement) * this.axisIncrement;
        const totalRange = visualMaxValue - visualMinValue;

        return {
            minValue: visualMinValue,
            maxValue: visualMaxValue,
            totalRange: totalRange,
        };
    }

    private calculateAxisIncrement(
        items: ChartItem[],
        steps: number = DEFAULT_INCREMENT_SIZE
    ) {
        const maxValue = Math.max(
            ...items.map((item) => {
                const value = item.value;
                if (Array.isArray(value)) {
                    return Math.max(...value);
                }

                return value;
            })
        );

        const roughStep = maxValue / steps;

        const magnitude = 10 ** Math.floor(Math.log10(roughStep));

        return Math.ceil(roughStep / magnitude) * magnitude;
    }

    private getMinimumValue(item: ChartItem): number {
        const value = item.value;

        return Array.isArray(value) ? Math.min(...value) : value;
    }

    private getMaximumValue(item: ChartItem): number {
        const value = item.value;

        return Array.isArray(value) ? Math.max(...value) : value;
    }

    private isRangeItem(item: ChartItem): item is ChartItem<[number, number]> {
        return Array.isArray(item.value);
    }

    @Watch('items')
    @Watch('axisIncrement')
    @Watch('maxValue')
    handleChange() {
        this.range = null;
        this.recalculateRangeData();
    }

    private recalculateRangeData() {
        this.range = this.calculateRange();
    }

    private getClickableItem(target: HTMLElement): ChartItem | undefined {
        const index = target.dataset.index;
        if (index === undefined) {
            return;
        }

        const item = this.items[Number(index)];
        if (!item.clickable) {
            return;
        }

        return item;
    }

    private readonly handleClick = (event: MouseEvent) => {
        const item = this.getClickableItem(event.currentTarget as HTMLElement);
        if (!item) {
            return;
        }

        event.stopPropagation();
        this.interact.emit(item);
    };

    private readonly handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        const item = this.getClickableItem(event.currentTarget as HTMLElement);
        if (!item) {
            return;
        }

        event.preventDefault();
        this.interact.emit(item);
    };
}
