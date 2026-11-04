import {
    Component,
    Element,
    Event,
    EventEmitter,
    forceUpdate,
    h,
    Host,
    Prop,
    State,
    Watch,
} from '@stencil/core';
import {
    BarChart,
    GaugeChart,
    LineChart,
    PieChart,
    ScatterChart,
} from 'echarts/charts';
import {
    GridComponent,
    PolarComponent,
    TooltipComponent,
} from 'echarts/components';
import { init, use, type ECElementEvent, type ECharts } from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { Languages } from '../date-picker/date.types';
import translate from '../../global/translations';
import {
    findNavigationTarget,
    findTabStop,
    isNavigationKey,
    NavigationOrientation,
    NO_NAVIGATION_TARGET,
} from '../../util/keyboard-navigation';
import {
    ChartItem,
    ChartSeries,
    ChartType,
    ChartValueFormat,
} from './chart.types';
import {
    ChartDrawing,
    ChartSettings,
    drawChart,
    findItem,
    fitItemTexts,
    getDrawnItems,
    getDrawnSeries,
    getItemLabel,
    getSeriesGrid,
    getSeriesOfDrawnItems,
    getSwatchStyle,
    isStacked,
    locateItem,
} from './options';
import {
    canDrawSeries,
    canStack,
    DrawnChartType,
    getAxisRange,
    isDate,
    MAX_AXIS_STEPS,
    usesAxisIncrement,
} from './scale';
import {
    getAllItems,
    getAxisItems,
    getItemAt,
    getNearestSeries,
    ItemPosition,
    SeriesGrid,
} from './series';
import { canWriteIn, formatValue, isCurrencyCode, ValueStyle } from './format';
import {
    ChartTheme,
    createThemeReader,
    ThemeReader,
    watchTheme,
} from './theme';

const orientations: NavigationOrientation[] = ['horizontal', 'vertical'];

type WarnedProp =
    'axisIncrement' | 'language' | 'currency' | 'items' | 'series' | 'stacked';

const SERIES_COLOR_COUNT = 8;

const getDefaultSeriesColor = (index: number) =>
    `var(--limel-chart-series-color-${(index % SERIES_COLOR_COUNT) + 1})`;

const copyItem = (item: ChartItem): ChartItem => ({
    text: item.text,
    value: item.value,
    formattedValue: item.formattedValue,
    color: item.color,
    clickable: item.clickable,
});

const extensions = [
    BarChart,
    GaugeChart,
    LineChart,
    PieChart,
    ScatterChart,
    GridComponent,
    PolarComponent,
    TooltipComponent,
    SVGRenderer,
];

/**
 * A chart is a graphical representation of data, in which
 * visual symbols such as such bars, dots, lines, or slices, represent
 * each data point, in comparison to others.
 *
 * @exampleComponent limel-example-chart-type-proportion-bar
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
 * @exampleComponent limel-example-chart-value-format
 * @exampleComponent limel-example-chart-value-format-date
 * @exampleComponent limel-example-chart-clickable-items
 * @exampleComponent limel-example-chart-accessibility
 * @exampleComponent limel-example-chart-axis-labels
 * @exampleComponent limel-example-chart-series
 * @exampleComponent limel-example-chart-series-stacked
 * @exampleComponent limel-example-chart-styling
 * @beta
 */

@Component({
    tag: 'limel-chart',
    shadow: true,
    styleUrl: 'chart.scss',
})
export class Chart {
    /**
     * Defines the language for translations, and for the way values are
     * written, such as `1 234,5` in Swedish.
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
     * In a chart with series, the series name the columns of values, and
     * this label, when it is set, heads them all.
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
     * Applies to `proportion-bar`, `pie`, `doughnut`, and `ring` charts.
     */
    @Prop({ reflect: true })
    public displayItemPercentage = true;

    /**
     * List of items in the chart,
     * each representing a data point.
     */
    @Prop()
    public items?: ChartItem[];

    /**
     * Groups of items that are drawn side by side, each in a color of its
     * own, such as the revenue and the costs of each month. Items of
     * different series that have the same `text` are drawn together, at the
     * same place on the axis. When there are two series or more, a legend
     * names them.
     *
     * `bar`, `dot`, `line`, and `area` charts draw `series` instead of
     * `items`. Other types draw `items`, or the items of the first series
     * when `items` is not set.
     */
    @Prop()
    public series?: ChartSeries[];

    /**
     * Stacks the `series` on each other, so that each place on the axis
     * shows their total, such as the revenue of each product, which adds up
     * to the revenue of the month. Positive and negative values are stacked
     * on their own side of zero, and a range adds its extent to the stack.
     * Applies to `bar`, `line`, and `area` charts, but not when
     * `valueFormat` is `date`.
     */
    @Prop({ reflect: true })
    public stacked = false;

    /**
     * Defines how items are visualized in the chart.
     * `stacked-bar` is the old name of `proportion-bar`. It still works, but
     * logs a warning.
     */
    @Prop({ reflect: true })
    public type?: ChartType = 'proportion-bar';

    /**
     * Defines whether the chart is intended to be displayed wide or tall.
     * Does not have any effect on chart types which generate circular forms.
     */
    @Prop({ reflect: true })
    public orientation?: 'landscape' | 'portrait' = 'landscape';

    /**
     * Sets the value used to scale item values.
     * For `proportion-bar`, `pie`, `doughnut`, and `ring`, it is the denominator
     * used as the whole. It defaults to the combined item values or range
     * extents. The combined size can exceed `maxValue` and produce a total
     * above 100%.
     * For `bar`, `dot`, `area`, and `line`, it is the requested upper bound.
     * The chart can round that bound up to the next `axisIncrement`, or to
     * the end of its day when `valueFormat` is `date`.
     * Has no effect on `nps` or `scatter`.
     */
    @Prop({ reflect: true })
    public maxValue?: number;

    /**
     * Sets the axis increment for `bar`, `dot`, `area`, and `line` charts.
     * When it is not set, or not above zero, the chart works out a step
     * from the values. It also does that when the step would divide the
     * axis into more than 100 parts, so that it does not draw too many lines.
     * Has no effect on other chart types, or when `valueFormat` is `date`,
     * where the axis steps through days, weeks, months or years by itself.
     */
    @Prop({ reflect: true })
    public axisIncrement?: number;

    /**
     * Defines how values are written: as numbers, as percentages where
     * `0.25` is `25 %`, as amounts of `currency`, or as dates. With `date`,
     * each value is a date in milliseconds since 1970, and the value axis
     * steps through days, weeks, months or years. The axes, the values
     * shown with `displayItemValue`, the tooltips, and the screen reader
     * table all follow it, in the chart's `language`. An item's
     * `formattedValue` is shown as it is.
     */
    @Prop({ reflect: true })
    public valueFormat: ChartValueFormat = 'number';

    /**
     * The currency of the values when `valueFormat` is `currency`, as a
     * three-letter code such as `SEK`. Without one, the values are written
     * as numbers.
     */
    @Prop({ reflect: true })
    public currency?: string;

    /**
     * Indicates whether the chart is in a loading state.
     */
    @Prop({ reflect: true })
    public loading: boolean = false;

    /**
     * Fired when a chart item with `clickable` set to `true` is clicked.
     * The detail is the item itself, the same object as in `items` or in
     * `series`, so a chart with series can tell which series the item
     * belongs to by comparing it with the items of each series.
     */
    @Event()
    public interact: EventEmitter<ChartItem>;

    @Element()
    private readonly host: HTMLLimelChartElement;

    /**
     * The item that last had focus, which is the one that Tab returns to.
     */
    @State()
    private focusedPosition: ItemPosition = { series: 0, index: 0 };

    private plot?: HTMLElement;
    private chart?: ECharts;
    private drawing?: ChartDrawing;
    private drawnSettings?: string;
    private drawnTheme?: string;
    private grid: SeriesGrid = { categories: [], series: [] };
    private seriesColors: string[] = [];
    private themeMayHaveChanged = false;
    private itemSpace?: number;
    private readonly warnings = new Map<WarnedProp, string>();
    private readonly invalidColors = new Set<string>();
    private themeReader?: ThemeReader;
    private resizeObserver?: ResizeObserver;
    private stopWatchingTheme?: () => void;

    public componentWillLoad() {
        this.warnAboutOldTypeName();
    }

    public componentWillRender() {
        this.grid = getSeriesGrid({
            type: this.chartType,
            items: this.items,
            series: this.series,
        });
        this.warnOnChange('axisIncrement', this.getAxisIncrementWarning());
        this.warnOnChange('language', this.getLanguageWarning());
        this.warnOnChange('currency', this.getCurrencyWarning());
        this.warnOnChange('items', this.getDateWarning());
        this.warnOnChange('series', this.getSeriesWarning());
        this.warnOnChange('stacked', this.getStackedWarning());
    }

    public connectedCallback() {
        this.draw();
    }

    public componentDidRender() {
        this.draw();
    }

    public disconnectedCallback() {
        this.disposeChart();
        this.resizeObserver?.disconnect();
        this.resizeObserver = undefined;
        this.stopWatchingTheme?.();
        this.stopWatchingTheme = undefined;
        this.themeReader?.dispose();
        this.themeReader = undefined;
    }

    private warnOnChange(prop: WarnedProp, warning?: string) {
        if (warning && warning !== this.warnings.get(prop)) {
            console.warn(warning);
        }

        this.warnings.set(prop, warning);
    }

    @Watch('type')
    protected warnAboutOldTypeName() {
        if (this.type === 'stacked-bar') {
            console.warn(
                'limel-chart: the type `stacked-bar` is now called `proportion-bar`. It draws the same chart, but please use the new name.'
            );
        }
    }

    private getLanguageWarning(): string | undefined {
        if (canWriteIn(this.language)) {
            return;
        }

        return `limel-chart: \`language\` must be one that this browser can write values in, such as \`sv\`, but was ${JSON.stringify(this.language)}. Writing the values in English instead.`;
    }

    private getCurrencyWarning(): string | undefined {
        if (this.valueFormat !== 'currency' || isCurrencyCode(this.currency)) {
            return;
        }

        return `limel-chart: \`currency\` must be a three-letter code such as \`SEK\` when \`valueFormat\` is \`currency\`, but was ${JSON.stringify(this.currency)}. Writing the values as numbers instead.`;
    }

    private getDateWarning(): string | undefined {
        if (this.valueFormat !== 'date') {
            return;
        }

        const wrong = getAllItems(this.grid)
            .flatMap((item) => [item.value].flat())
            .find((value) => !isDate(value));
        if (wrong === undefined) {
            return;
        }

        const shown = typeof wrong === 'number' ? wrong : JSON.stringify(wrong);

        return `limel-chart: with \`valueFormat\` \`date\`, each value must be a date in milliseconds since 1970, as \`Date.getTime()\` gives, but was ${shown}. Showing it as it is.`;
    }

    private getSeriesWarning(): string | undefined {
        if (!this.series?.length) {
            return;
        }

        if (!canDrawSeries(this.chartType)) {
            const drawn = this.items?.length
                ? '`items`'
                : 'the items of the first series';

            return `limel-chart: \`series\` can only be drawn by \`bar\`, \`dot\`, \`line\`, and \`area\` charts, but \`type\` is \`${this.type}\`. Drawing ${drawn} instead.`;
        }

        if (this.items?.length) {
            return 'limel-chart: both `items` and `series` are set. Drawing `series`, and leaving out `items`.';
        }
    }

    private getStackedWarning(): string | undefined {
        if (!this.stacked) {
            return;
        }

        if (!canStack(this.chartType)) {
            return `limel-chart: \`stacked\` can only stack the series of \`bar\`, \`line\`, and \`area\` charts, but \`type\` is \`${this.type}\`. Ignoring \`stacked\`.`;
        }

        if (this.valueFormat === 'date') {
            return 'limel-chart: `stacked` cannot stack dates. Ignoring `stacked`.';
        }

        if (!this.drawsSeries) {
            return 'limel-chart: `stacked` stacks the `series` of a chart, but this chart has none. Ignoring `stacked`.';
        }
    }

    private get stacksSeries(): boolean {
        return isStacked({
            type: this.chartType,
            series: this.series,
            stacked: this.stacked,
            valueFormat: this.valueFormat,
        });
    }

    private get drawsSeries(): boolean {
        return Boolean(this.drawnSeries);
    }

    private get drawnSeries(): ChartSeries[] | undefined {
        return getDrawnSeries({ type: this.chartType, series: this.series });
    }

    private get drawnItems(): ChartItem[] {
        return getDrawnItems({
            type: this.chartType,
            items: this.items,
            series: this.series,
        });
    }

    private get valueStyle(): ValueStyle {
        return {
            type: this.chartType,
            language: this.language,
            valueFormat: this.valueFormat,
            currency: this.currency,
        };
    }

    private get chartType(): DrawnChartType {
        return this.type === 'stacked-bar' ? 'proportion-bar' : this.type;
    }

    private getAxisIncrementWarning(): string | undefined {
        const increment = this.axisIncrement;
        if (
            increment === undefined ||
            increment === null ||
            this.valueFormat === 'date'
        ) {
            return;
        }

        if (increment <= 0 || Number.isNaN(increment)) {
            return `limel-chart: \`axisIncrement\` must be above 0, but was ${increment}. Working out a step from the values instead.`;
        }

        if (!usesAxisIncrement(this.chartType)) {
            return;
        }

        const range = getAxisRange(
            getAxisItems(this.grid, this.stacksSeries),
            this.maxValue,
            increment
        );
        if (range.increment !== increment) {
            return `limel-chart: \`axisIncrement\` ${increment} would divide the axis into more than ${MAX_AXIS_STEPS} steps. Working out a step from the values instead.`;
        }
    }

    public render() {
        if (this.loading) {
            return <limel-spinner limeBranded={false} />;
        }

        return (
            <Host>
                {this.renderLegend()}
                <div class="plot" aria-hidden="true" ref={this.setPlot} />
                <table aria-live="polite">
                    {this.renderCaption()}
                    {this.renderTableHeader()}
                    <tbody>
                        {this.drawsSeries
                            ? this.renderCategories()
                            : this.renderItems()}
                    </tbody>
                </table>
            </Host>
        );
    }

    private get hasLegend(): boolean {
        return (this.drawnSeries?.length ?? 0) > 1;
    }

    private renderLegend() {
        if (!this.hasLegend) {
            return;
        }

        return (
            <ul aria-hidden="true">
                {this.drawnSeries.map((series, index) => (
                    <li>
                        <span
                            style={getSwatchStyle(
                                this.chartType,
                                this.seriesColors[index]
                            )}
                        />
                        {series.text}
                    </li>
                ))}
            </ul>
        );
    }

    private renderCaption() {
        if (!this.accessibleLabel) {
            return;
        }

        return <caption>{this.accessibleLabel}</caption>;
    }

    private renderTableHeader() {
        const columns = this.drawnSeries?.map((series) => series.text) ?? [
            this.valuesLabel,
        ];

        return (
            <thead>
                {this.renderSeriesGroupHeader()}
                <tr>
                    <th scope="col">{this.itemsLabel}</th>
                    {columns.map((column) => (
                        <th scope="col">{column}</th>
                    ))}
                </tr>
            </thead>
        );
    }

    private renderSeriesGroupHeader() {
        const allSeries = this.drawnSeries;
        if (!allSeries || !this.accessibleValuesLabel) {
            return;
        }

        return (
            <tr>
                <td />
                <th scope="col" colSpan={allSeries.length}>
                    {this.accessibleValuesLabel}
                </th>
            </tr>
        );
    }

    private get itemsLabel() {
        return (
            this.accessibleItemsLabel ?? translate.get('items', this.language)
        );
    }

    private get valuesLabel() {
        return (
            this.accessibleValuesLabel ?? translate.get('value', this.language)
        );
    }

    private renderItems() {
        const items = this.drawnItems;
        const tabStop = findTabStop(items, this.focusedPosition.index);

        return items.map((item, index) => (
            <tr
                data-index={index}
                aria-description={this.getRowDescription(index)}
                tabIndex={index === tabStop ? 0 : -1}
                role={item.clickable ? 'button' : null}
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
            >
                <td>{item.text}</td>
                <td>{formatValue(item, this.valueStyle)}</td>
            </tr>
        ));
    }

    private getRowDescription(index: number): string | undefined {
        const items = this.drawnItems;
        const label = getItemLabel(
            {
                ...this.valueStyle,
                items: items,
                maxValue: this.maxValue,
                displayItemPercentage: this.displayItemPercentage,
            },
            index
        );

        return label === items[index].text ? undefined : label;
    }

    private renderCategories() {
        const grid = this.grid;
        const tabStop = this.findTabStopInGrid(grid);

        return grid.categories.map((category, index) => (
            <tr>
                <th scope="row">{category}</th>
                {grid.series.map((series, seriesIndex) =>
                    this.renderCell(
                        series.items[index],
                        { series: seriesIndex, index: index },
                        tabStop
                    )
                )}
            </tr>
        ));
    }

    private renderCell(
        item: ChartItem | undefined,
        position: ItemPosition,
        tabStop?: ItemPosition
    ) {
        if (!item) {
            return <td />;
        }

        const isTabStop =
            position.series === tabStop?.series &&
            position.index === tabStop?.index;

        return (
            <td
                data-series={position.series}
                data-index={position.index}
                tabIndex={isTabStop ? 0 : -1}
                role={item.clickable ? 'button' : undefined}
                aria-label={
                    item.clickable ? this.getButtonLabel(item, position) : null
                }
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
            >
                {formatValue(item, this.valueStyle)}
            </td>
        );
    }

    private getButtonLabel(item: ChartItem, position: ItemPosition): string {
        return [
            this.grid.categories[position.index],
            this.grid.series[position.series].text,
            formatValue(item, this.valueStyle),
        ].join(', ');
    }

    private findTabStopInGrid(grid: SeriesGrid): ItemPosition | undefined {
        const focused = this.focusedPosition;
        if (getItemAt(grid, focused)) {
            return focused;
        }

        const first = { series: 0, index: 0 };
        const series = getNearestSeries(grid, first);
        if (series === undefined) {
            return;
        }

        return { ...first, series: series };
    }

    private draw() {
        if (!this.plot?.isConnected) {
            this.disposeChart();

            return;
        }

        this.observeSize();
        const { clientWidth: width, clientHeight: height } = this.plot;
        if (width && !height) {
            this.host.toggleAttribute('data-fallback-height', true);
        }

        if (!width || !height) {
            return;
        }

        this.createChart();
        if (
            width !== this.chart.getWidth() ||
            height !== this.chart.getHeight()
        ) {
            this.chart.resize();
        }

        this.updateChart();
        this.fitItemTextsToSize();
    }

    private createChart() {
        if (this.chart?.getDom() === this.plot) {
            return;
        }

        this.disposeChart();
        /*!
         * Apache ECharts
         * Copyright 2017-2026 The Apache Software Foundation
         *
         * This product includes software developed at
         * The Apache Software Foundation (https://www.apache.org/).
         *
         * Licensed under the Apache License, Version 2.0
         * (https://www.apache.org/licenses/LICENSE-2.0).
         *
         *
         * ZRender
         * Copyright (c) 2017, Baidu Inc.
         * All rights reserved.
         *
         * Redistribution and use in source and binary forms, with or without
         * modification, are permitted provided that the following conditions are met:
         *
         * * Redistributions of source code must retain the above copyright notice, this
         *   list of conditions and the following disclaimer.
         *
         * * Redistributions in binary form must reproduce the above copyright notice,
         *   this list of conditions and the following disclaimer in the documentation
         *   and/or other materials provided with the distribution.
         *
         * * Neither the name of the copyright holder nor the names of its
         *   contributors may be used to endorse or promote products derived from
         *   this software without specific prior written permission.
         *
         * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
         * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
         * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
         * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
         * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
         * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
         * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
         * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
         * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
         * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
         */
        use(extensions);
        this.chart = init(this.plot, null, { renderer: 'svg' });
        this.chart.on('click', this.handleChartClick);
        this.chart.on('mouseover', this.handleChartOver);
        this.chart.on('mouseout', this.handleChartOut);
    }

    private updateChart() {
        const settings = this.getSettings();
        const drawnSettings = JSON.stringify(settings);
        if (drawnSettings === this.drawnSettings && !this.themeMayHaveChanged) {
            return;
        }

        this.themeMayHaveChanged = false;
        this.stopWatchingTheme ??= watchTheme(
            this.host,
            this.handleThemeChange
        );
        const theme = this.getThemeReader().theme();
        const coloredSettings = this.withItemColors(settings, theme);
        const drawnTheme = JSON.stringify({
            theme: theme,
            itemColors: coloredSettings.items.map((item) => item.color),
            seriesColors: coloredSettings.series?.map((series) => [
                series.color,
                ...series.items.map((item) => item.color),
            ]),
        });
        if (
            drawnSettings === this.drawnSettings &&
            drawnTheme === this.drawnTheme
        ) {
            return;
        }

        this.drawnSettings = drawnSettings;
        this.drawnTheme = drawnTheme;
        this.drawing = drawChart(coloredSettings, theme, this.itemSpace);
        this.chart.setOption(this.drawing.option, { notMerge: true });
        this.showSeriesColors(
            coloredSettings.series?.map((series) => series.color) ?? []
        );

        const focused = this.host.shadowRoot.activeElement;
        if (focused instanceof HTMLElement && focused.dataset.index) {
            this.showItem(focused, true);
        }
    }

    private fitItemTextsToSize() {
        const axis = this.drawing?.itemTextAxis;
        if (!axis) {
            return;
        }

        const finder = { [`${axis}Index`]: 0 };
        const itemSpace = Math.floor(
            Math.abs(
                this.chart.convertToPixel(finder, 1) -
                    this.chart.convertToPixel(finder, 0)
            )
        );
        if (itemSpace === this.itemSpace) {
            return;
        }

        this.itemSpace = itemSpace;
        this.chart.setOption(fitItemTexts(this.drawing, itemSpace));
    }

    private getSettings(): ChartSettings {
        return {
            items: this.drawnItems.map((item) => copyItem(item)),
            series: this.drawnSeries?.map((series) => ({
                text: series.text,
                color: series.color,
                items: (series.items ?? []).map((item) => copyItem(item)),
            })),
            stacked: this.stacksSeries,
            ...this.valueStyle,
            orientation: this.orientation,
            maxValue: this.maxValue,
            axisIncrement: this.axisIncrement,
            displayAxisLabels: this.displayAxisLabels,
            itemsLabel: this.itemsLabel,
            valuesLabel: this.valuesLabel,
            displayItemText: this.displayItemText,
            displayItemValue: this.displayItemValue,
            displayItemPercentage: this.displayItemPercentage,
        };
    }

    private withItemColors(
        settings: ChartSettings,
        theme: ChartTheme
    ): ChartSettings {
        const seriesOfItems = getSeriesOfDrawnItems({
            type: this.chartType,
            items: this.items,
            series: this.series,
        });
        const itemColor = seriesOfItems
            ? this.getSeriesColor(seriesOfItems, 0, theme)
            : theme.itemColor;
        const itemFallback = seriesOfItems
            ? 'the color of its series'
            : 'the default item color';

        return {
            ...settings,
            items: settings.items.map((item) => ({
                ...item,
                color:
                    this.readColor(item.color, 'item', itemFallback) ??
                    itemColor,
            })),
            series: settings.series?.map((series, index) => {
                const color = this.getSeriesColor(series, index, theme);

                return {
                    ...series,
                    color: color,
                    items: series.items.map((item) => ({
                        ...item,
                        color:
                            this.readColor(
                                item.color,
                                'item',
                                'the color of its series'
                            ) ?? color,
                    })),
                };
            }),
        };
    }

    private getSeriesColor(
        series: ChartSeries,
        index: number,
        theme: ChartTheme
    ): string {
        return (
            this.readColor(
                series.color,
                'series',
                'the default series color'
            ) ??
            this.getThemeReader().color(getDefaultSeriesColor(index)) ??
            theme.itemColor
        );
    }

    private showSeriesColors(colors: string[]) {
        const shown = this.seriesColors;
        const same =
            colors.length === shown.length &&
            colors.every((color, index) => color === shown[index]);
        if (same) {
            return;
        }

        this.seriesColors = colors;
        if (this.hasLegend) {
            forceUpdate(this);
        }
    }

    private readColor(
        color: string | undefined,
        owner: 'item' | 'series',
        fallback: string
    ): string | undefined {
        if (!color) {
            return;
        }

        const resolved = this.getThemeReader().color(color);
        if (!resolved && !this.invalidColors.has(color)) {
            this.invalidColors.add(color);
            const hint = color.includes('var(')
                ? ' Check that its variables are set, and that they make a color.'
                : '';
            const article = owner === 'item' ? 'an' : 'a';
            console.warn(
                `limel-chart: the color of ${article} ${owner} must be a CSS color, but was \`${color}\`.${hint} Using ${fallback} instead.`
            );
        }

        return resolved;
    }

    private getThemeReader(): ThemeReader {
        this.themeReader ??= createThemeReader(this.host.shadowRoot);

        return this.themeReader;
    }

    private observeSize() {
        if (this.resizeObserver || typeof ResizeObserver === 'undefined') {
            return;
        }

        this.resizeObserver = new ResizeObserver(this.handleResize);
        this.resizeObserver.observe(this.host);
    }

    private disposeChart() {
        this.chart?.dispose();
        this.chart = undefined;
        this.drawing = undefined;
        this.drawnSettings = undefined;
        this.drawnTheme = undefined;
        this.itemSpace = undefined;
    }

    private readonly setPlot = (element?: HTMLElement) => {
        this.plot = element;
    };

    private readonly handleResize = () => {
        this.draw();
    };

    private readonly handleThemeChange = () => {
        this.themeMayHaveChanged = true;
        this.draw();
    };

    private readonly handleChartClick = (event: ECElementEvent) => {
        if (!this.drawing) {
            return;
        }

        const item = this.getClickableItem(this.getClickedPosition(event));
        if (!item) {
            return;
        }

        event.event?.event?.stopPropagation();
        this.interact.emit(item);
    };

    private getClickedPosition(event: ECElementEvent): ItemPosition {
        const position = findItem(this.drawing, event);
        if (event.seriesType !== 'line' || !event.event) {
            return position;
        }

        return { ...position, index: this.getNearestPlace(event.event) };
    }

    private getNearestPlace(pixel: { offsetX: number; offsetY: number }) {
        const landscape = this.orientation === 'landscape';
        const place = this.chart.convertFromPixel(
            landscape ? { xAxisIndex: 0 } : { yAxisIndex: 0 },
            landscape ? pixel.offsetX : pixel.offsetY
        );

        return Math.round(place);
    }

    private readonly handleChartOver = (event: ECElementEvent) => {
        this.highlightItemAt(event, true);
    };

    private readonly handleChartOut = (event: ECElementEvent) => {
        this.highlightItemAt(event, false);
    };

    private highlightItemAt(event: ECElementEvent, highlight: boolean) {
        if (!this.drawing) {
            return;
        }

        const location = locateItem(
            this.drawing,
            findItem(this.drawing, event)
        );
        if (location.seriesIndex === event.seriesIndex) {
            return;
        }

        this.chart.dispatchAction({
            type: highlight ? 'highlight' : 'downplay',
            ...location,
        });
    }

    private getClickableItem(position: ItemPosition): ChartItem | undefined {
        const item = getItemAt(this.grid, position);
        if (!item?.clickable) {
            return;
        }

        return item;
    }

    private getPosition(element: HTMLElement): ItemPosition {
        return {
            series: Number(element.dataset.series ?? 0),
            index: Number(element.dataset.index),
        };
    }

    private getEventPosition(event: Event): ItemPosition {
        return this.getPosition(event.currentTarget as HTMLElement);
    }

    private readonly handleClick = (event: MouseEvent) => {
        const item = this.getClickableItem(this.getEventPosition(event));
        if (!item) {
            return;
        }

        event.stopPropagation();
        this.interact.emit(item);
    };

    private readonly handleKeyDown = (event: KeyboardEvent) => {
        const orientation = orientations.find((option) =>
            isNavigationKey(event, { orientation: option })
        );
        if (orientation) {
            event.preventDefault();
            this.focusItem(
                this.findTarget(
                    event.key,
                    this.getEventPosition(event),
                    orientation
                )
            );

            return;
        }

        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        const item = this.getClickableItem(this.getEventPosition(event));
        if (!item) {
            return;
        }

        event.preventDefault();
        this.interact.emit(item);
    };

    private findTarget(
        key: string,
        position: ItemPosition,
        orientation: NavigationOrientation
    ): ItemPosition {
        if (!this.drawsSeries) {
            const items = this.drawnItems;
            const index = findNavigationTarget(items, key, position.index, {
                orientation: orientation,
            });

            return { series: 0, index: index };
        }

        const grid = this.grid;
        if (orientation === 'horizontal') {
            const items = grid.series.map(
                (series) => series.items[position.index]
            );
            const series = findNavigationTarget(items, key, position.series, {
                orientation: orientation,
                isDisabled: (item?: ChartItem) => !item,
            });

            return { series: series, index: position.index };
        }

        const index = findNavigationTarget(
            grid.categories,
            key,
            position.index,
            { orientation: orientation }
        );
        const series = getNearestSeries(grid, {
            series: position.series,
            index: index,
        });

        return { series: series ?? NO_NAVIGATION_TARGET, index: index };
    }

    private readonly handleFocus = (event: FocusEvent) => {
        const element = event.currentTarget as HTMLElement;
        this.focusedPosition = this.getPosition(element);
        this.showItem(element, true);
    };

    private readonly handleBlur = (event: FocusEvent) => {
        this.showItem(event.currentTarget as HTMLElement, false);
    };

    private focusItem(position: ItemPosition) {
        if (
            position.series === NO_NAVIGATION_TARGET ||
            position.index === NO_NAVIGATION_TARGET
        ) {
            return;
        }

        const series = this.drawsSeries
            ? `[data-series="${position.series}"]`
            : '';
        const element = this.host.shadowRoot.querySelector<HTMLElement>(
            `tbody [data-index="${position.index}"]${series}`
        );
        element?.focus();
    }

    private showItem(element: HTMLElement, show: boolean) {
        if (!this.chart || !this.drawing) {
            return;
        }

        const position = this.getPosition(element);
        const location = locateItem(this.drawing, position);
        this.chart.dispatchAction({
            type: show ? 'highlight' : 'downplay',
            ...location,
        });
        if (!show) {
            this.chart.dispatchAction(
                this.drawsSeries
                    ? { type: 'updateAxisPointer', currTrigger: 'leave' }
                    : { type: 'hideTip' }
            );

            return;
        }

        this.chart.dispatchAction({
            type: 'showTip',
            ...(this.drawsSeries
                ? this.getMiddleOfPlace(position.index)
                : location),
        });
    }

    private getMiddleOfPlace(index: number): { x: number; y: number } {
        const { minValue, maxValue } = this.drawing.valueRange;
        const middle = (minValue + maxValue) / 2;
        const [x, y] = this.chart.convertToPixel(
            { gridIndex: 0 },
            this.orientation === 'landscape' ? [index, middle] : [middle, index]
        );

        return { x: x, y: y };
    }
}
