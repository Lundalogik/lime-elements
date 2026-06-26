import { Component, Event, EventEmitter, h, Prop, Watch } from '@stencil/core';
import { Languages } from '../date-picker/date.types';
import translate from '../../global/translations';
import { createRandomString } from '../../util/random-string';
import { ChartItem } from './chart.types';

const PERCENT = 100;
const DEFAULT_INCREMENT_SIZE = 10;

interface AxisRange {
    minValue: number;
    maxValue: number;
    totalRange: number;
    /** Step between adjacent axis lines, used to render the grid. */
    increment: number;
}

/**
 * A chart is a graphical representation of data, in which
 * visual symbols such as such bars, dots, lines, or slices, represent
 * each data point, in comparison to others.
 *
 * @exampleComponent limel-example-chart-stacked-bar
 * @exampleComponent limel-example-chart-orientation
 * @exampleComponent limel-example-chart-max-value
 * @exampleComponent limel-example-chart-type-bar
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
 * @exampleComponent limel-example-chart-axis-labels
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
     * Defaults to the translation for "items" in the current language.
     */
    @Prop({ reflect: true })
    public accessibleItemsLabel?: string;

    /**
     * Helps users of assistive technologies to understand
     * what the values in the chart represent.
     * Defaults to the translation for "value" in the current language.
     */
    @Prop({ reflect: true })
    public accessibleValuesLabel?: string;

    /**
     * When set to true, renders visible labels for X and Y axes.
     * Only affects chart types with X and Y axes, such as area, bar, and line charts.
     */

    @Prop({ reflect: true })
    public displayAxisLabels = false;

    /**
     * Makes the `text` of chart items constantly visible,
     * By default, item texts are displayed in a tooltip,
     * when the item is hovered or focused.
     * Only affects chart types with X and Y axes, such as area, bar, and line charts.
     */
    @Prop({ reflect: true })
    public displayItemText = false;

    /**
     * Makes the `value` (or `formattedValue`) of chart items constantly visible,
     * By default, item values are displayed in a tooltip,
     * when the item is hovered or focused.
     * Only affects chart types with X and Y axes, such as area, bar, and line charts.
     */
    @Prop({ reflect: true })
    public displayItemValue = false;

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
        | 'scatter'
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
     * Range of the value axis. For most chart types this is the single value
     * axis. For `scatter` it is the range of each point's second value
     * (`value[1]`); the shared axis-line rendering always draws its grid and
     * badges from this range. Whether it runs vertically (landscape) or
     * horizontally (portrait) is decided by `orientation`.
     */
    private range: AxisRange;

    /**
     * Range of each scatter point's first value (`value[0]`). Only used by the
     * `scatter` type, where both values are plotted on value axes. It is laid
     * out on the opposite screen edge to `range` — horizontally in landscape,
     * vertically in portrait.
     */
    private secondaryAxisRange: AxisRange;

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

        return (
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
                    <th scope="col">
                        {this.accessibleItemsLabel ??
                            translate.get('items', this.language)}
                    </th>
                    <th scope="col">
                        {this.accessibleValuesLabel ??
                            translate.get('value', this.language)}
                    </th>
                </tr>
            </thead>
        );
    }

    private renderAxises() {
        if (!['bar', 'dot', 'area', 'line', 'scatter'].includes(this.type)) {
            return;
        }

        if (this.type === 'scatter') {
            return this.renderScatterAxises();
        }

        return this.renderAxisLines(this.range);
    }

    // Two value axes, so a full grid: horizontal lines for the vertical axis,
    // vertical lines for the horizontal one. Which range maps to which flips
    // with `orientation`, like the points.
    private renderScatterAxises() {
        const portrait = this.orientation === 'portrait';
        const horizontalLines = portrait ? this.secondaryAxisRange : this.range;
        const verticalLines = portrait ? this.range : this.secondaryAxisRange;

        return [
            this.renderAxisLines(horizontalLines, 'horizontal-lines'),
            this.renderAxisLines(verticalLines, 'vertical-lines'),
        ];
    }

    private renderAxisLines(range: AxisRange, direction?: string) {
        const { minValue, maxValue, increment } = range;
        const lines = [];

        for (let value = minValue; value <= maxValue; value += increment) {
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

        const cssClass: Record<string, boolean> = { axises: true };
        if (direction) {
            cssClass[direction] = true;
        }

        return (
            <div class={cssClass} role="presentation" key={direction}>
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
                    <td class="text">{this.getItemText(item)}</td>
                    <td class="value">{this.getFormattedValue(item)}</td>
                    {this.renderTooltip(item, itemId, size)}
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
        if (this.type === 'scatter') {
            return this.getScatterItemStyle(item, index);
        }

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

    private getScatterItemStyle(
        item: ChartItem,
        index: number
    ): Record<string, string> {
        const style: Record<string, string> = {
            '--limel-chart-item-offset-x': `${this.normalize(
                this.getXValue(item),
                this.secondaryAxisRange
            )}`,
            '--limel-chart-item-offset-y': `${this.normalize(
                this.getYValue(item),
                this.range
            )}`,
            '--limel-chart-item-index': `${index}`,
        };

        if (item.color) {
            style['--limel-chart-item-color'] = item.color;
        }

        return style;
    }

    private getItemClass(item: ChartItem) {
        return {
            item: true,
            'has-start-value':
                this.type !== 'scatter' && Array.isArray(item.value),
            'has-negative-value-only':
                this.getMaximumValue(item) < 0 && !this.isRangeItem(item),
            // Scatter coordinates are independent values, so "value is zero"
            // (which hides the value label elsewhere) must not apply.
            'has-value-zero':
                this.type !== 'scatter' && this.getMaximumValue(item) === 0,
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
            if (this.type === 'scatter') {
                return `(${value[0]}, ${value[1]})`;
            }

            return `${value[0]} — ${value[1]}`;
        }

        return `${value}`;
    }

    private getItemText(item: ChartItem): string {
        return item.text;
    }

    private renderTooltip(item: ChartItem, itemId: string, size: number) {
        const text = this.getItemText(item);
        const PERCENT_DECIMAL = 2;
        const formattedValue = this.getFormattedValue(item);

        const tooltipProps: any = {
            label: text,
            helperLabel: formattedValue,
            elementId: itemId,
        };

        if (
            this.type !== 'bar' &&
            this.type !== 'dot' &&
            this.type !== 'nps' &&
            this.type !== 'scatter'
        ) {
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
            this.axisIncrement = this.calculateAxisIncrement(
                this.items.map(this.getMaximumValue)
            );
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
            increment: this.axisIncrement,
        };
    }

    private calculateAxisIncrement(
        values: number[],
        steps: number = DEFAULT_INCREMENT_SIZE
    ) {
        return this.calculateNiceStep(Math.max(...values), steps);
    }

    // A "nice" step (…× 10ⁿ) dividing `span` into ~`steps` intervals. Takes the
    // axis length, not a raw max, so it's sign-safe (a negative max would make
    // `Math.log10` return `NaN`).
    private calculateNiceStep(
        span: number,
        steps: number = DEFAULT_INCREMENT_SIZE
    ): number {
        if (span <= 0) {
            // Every value is identical (e.g. all zero); any positive step works.
            return 1;
        }

        const roughStep = span / steps;
        const magnitude = 10 ** Math.floor(Math.log10(roughStep));

        return Math.ceil(roughStep / magnitude) * magnitude;
    }

    // Axis length measured through zero, so the origin is always included.
    private axisSpan(values: number[]): number {
        return Math.max(0, ...values) - Math.min(0, ...values);
    }

    // A "nice" rounded range for one scatter axis. Both bounds include zero, so
    // a fully-negative axis still shows its origin (and zero line).
    private calculateAxisRange(values: number[], increment: number): AxisRange {
        const minValue =
            Math.floor(Math.min(0, ...values) / increment) * increment;
        const maxValue =
            Math.ceil(Math.max(0, ...values) / increment) * increment;

        return {
            minValue: minValue,
            maxValue: maxValue,
            totalRange: maxValue - minValue,
            increment: increment,
        };
    }

    private normalize(value: number, range: AxisRange): number {
        if (range.totalRange === 0) {
            // Degenerate axis (every value is zero): center the point so it
            // stays visible instead of dividing by zero.
            return PERCENT / 2;
        }

        return ((value - range.minValue) / range.totalRange) * PERCENT;
    }

    private getXValue(item: ChartItem): number {
        return Array.isArray(item.value) ? item.value[0] : item.value;
    }

    private getYValue(item: ChartItem): number {
        return Array.isArray(item.value) ? item.value[1] : item.value;
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
        this.secondaryAxisRange = null;
        this.recalculateRangeData();
    }

    private recalculateRangeData() {
        if (this.type === 'scatter') {
            this.recalculateScatterRanges();

            return;
        }

        this.range = this.calculateRange();
    }

    // Each axis derives its own range and step from its own zero-anchored span
    // (positive, negative, and zero-crossing data all grid sensibly). The single
    // `axisIncrement` prop can't describe two independent axes, so scatter
    // ignores it and auto-derives both, like it does `maxValue`.
    private recalculateScatterRanges() {
        const xValues = this.items.map((item) => this.getXValue(item));
        const yValues = this.items.map((item) => this.getYValue(item));

        this.range = this.calculateAxisRange(
            yValues,
            this.calculateNiceStep(this.axisSpan(yValues))
        );
        this.secondaryAxisRange = this.calculateAxisRange(
            xValues,
            this.calculateNiceStep(this.axisSpan(xValues))
        );
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
