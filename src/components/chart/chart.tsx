import { Component, Event, EventEmitter, h, Prop, Watch } from '@stencil/core';
import { Languages } from '../date-picker/date.types';
import translate from '../../global/translations';
import { createRandomString } from '../../util/random-string';
import { ChartItem, ChartType } from './chart.types';
import {
    AxisRange,
    formatValue,
    getAxisRange,
    getMaximumValue,
    getMinimumValue,
    getScatterRanges,
    getShare,
    getWholeRange,
    getXValue,
    getYValue,
    isPartOfWhole,
    isRangeItem,
} from './scale';

const PERCENT = 100;

/**
 * A chart is a graphical representation of data, in which
 * visual symbols such as such bars, dots, lines, or slices, represent
 * each data point, in comparison to others.
 *
 * @exampleComponent limel-example-chart-stacked-bar
 * @exampleComponent limel-example-chart-orientation
 * @exampleComponent limel-example-chart-max-value
 * @exampleComponent limel-example-chart-display-item-percentage
 * @exampleComponent limel-example-chart-type-bar
 * @exampleComponent limel-example-chart-type-dot
 * @exampleComponent limel-example-chart-type-area
 * @exampleComponent limel-example-chart-type-line
 * @exampleComponent limel-example-chart-type-scatter
 * @exampleComponent limel-example-chart-type-pie
 * @exampleComponent limel-example-chart-type-doughnut
 * @exampleComponent limel-example-chart-type-ring
 * @exampleComponent limel-example-chart-type-gantt
 * @exampleComponent limel-example-chart-type-nps
 * @exampleComponent limel-example-chart-multi-axis
 * @exampleComponent limel-example-chart-multi-axis-with-negative-start-values
 * @exampleComponent limel-example-chart-multi-axis-area-with-negative-start-values
 * @exampleComponent limel-example-chart-type-scatter-negative
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
     * Set to `false` to hide the percentage in item tooltips.
     * The percentage is an item's value or range extent as a share of the
     * whole. The whole is `maxValue` when set and the combined items otherwise.
     * Applies to `stacked-bar`, `pie`, `doughnut`, and `ring` charts.
     */
    @Prop({ reflect: true })
    public displayItemPercentage = true;

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
    public type?: ChartType = 'stacked-bar';

    /**
     * Defines whether the chart is intended to be displayed wide or tall.
     * Does not have any effect on chart types which generate circular forms.
     */
    @Prop({ reflect: true })
    public orientation?: 'landscape' | 'portrait' = 'landscape';

    /**
     * Sets the value used to scale item values.
     * For `stacked-bar`, `pie`, `doughnut`, and `ring`, it is the denominator
     * used as the whole. It defaults to the combined item values or range
     * extents. The combined size can exceed `maxValue` and produce a total
     * above 100%.
     * For `bar`, `dot`, `area`, and `line`, it is the requested upper bound.
     * The chart can round that bound up to the next `axisIncrement`.
     * Has no effect on `nps` or `scatter`.
     */
    @Prop({ reflect: true })
    public maxValue?: number;

    /**
     * Sets the axis increment for `bar`, `dot`, `area`, and `line` charts.
     * When it is not set, or not above zero, the chart works out a step
     * from the values.
     * Has no effect on other chart types.
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
        this.warnAboutAxisIncrement();
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
                    <td class="text">{item.text}</td>
                    <td class="value">{formatValue(item, this.type)}</td>
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
                getXValue(item),
                this.secondaryAxisRange
            )}`,
            '--limel-chart-item-offset-y': `${this.normalize(
                getYValue(item),
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
                getMaximumValue(item) < 0 && !isRangeItem(item),
            // Scatter coordinates are independent values, so "value is zero"
            // (which hides the value label elsewhere) must not apply.
            'has-value-zero':
                this.type !== 'scatter' && getMaximumValue(item) === 0,
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

        if (isPartOfWhole(this.type)) {
            return {
                size: getShare(item, this.range),
                offset: 0,
            };
        }

        let startValue = 0;
        if (isRangeItem(item)) {
            startValue = getMinimumValue(item);
        }

        const normalizedStart =
            ((startValue - minValue) / totalRange) * PERCENT;
        const normalizedEnd =
            ((getMaximumValue(item) - minValue) / totalRange) * PERCENT;

        return {
            size: normalizedEnd - normalizedStart,
            offset: normalizedStart,
        };
    }

    private renderTooltip(item: ChartItem, itemId: string, size: number) {
        const PERCENT_DECIMAL = 2;
        const formattedValue = formatValue(item, this.type);

        const tooltipProps: any = {
            label: item.text,
            helperLabel: formattedValue,
            elementId: itemId,
        };

        if (this.displayItemPercentage && isPartOfWhole(this.type)) {
            tooltipProps.label = `${item.text} (${size.toFixed(PERCENT_DECIMAL)}%)`;
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

    private normalize(value: number, range: AxisRange): number {
        if (range.totalRange === 0) {
            // Degenerate axis (every value is zero): center the point so it
            // stays visible instead of dividing by zero.
            return PERCENT / 2;
        }

        return ((value - range.minValue) / range.totalRange) * PERCENT;
    }

    @Watch('items')
    @Watch('axisIncrement')
    @Watch('maxValue')
    @Watch('type')
    handleChange() {
        this.recalculateRangeData();
    }

    @Watch('axisIncrement')
    protected warnAboutAxisIncrement() {
        const increment = this.axisIncrement;
        if (increment === undefined || increment === null || increment > 0) {
            return;
        }

        console.warn(
            `limel-chart: \`axisIncrement\` must be above 0, but was ${increment}. Working out a step from the values instead.`
        );
    }

    private recalculateRangeData() {
        if (this.type === 'scatter') {
            const { x, y } = getScatterRanges(this.items);
            this.range = y;
            this.secondaryAxisRange = x;

            return;
        }

        this.secondaryAxisRange = null;
        this.range = isPartOfWhole(this.type)
            ? getWholeRange(this.items, this.maxValue)
            : getAxisRange(this.items, this.maxValue, this.axisIncrement);
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
