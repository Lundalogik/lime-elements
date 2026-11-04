import type {
    BarSeriesOption,
    GaugeSeriesOption,
    LineSeriesOption,
    PieSeriesOption,
    ScatterSeriesOption,
} from 'echarts/charts';
import type {
    GridComponentOption,
    PolarComponentOption,
    TooltipComponentOption,
} from 'echarts/components';
import { format, type ComposeOption } from 'echarts/core';
import { ChartItem, ChartSeries } from './chart.types';
import {
    AxisRange,
    canDrawSeries,
    DrawnChartType,
    getAxisRange,
    getDateRange,
    getDateTicks,
    getMaximumValue,
    getMinimumValue,
    getScatterRanges,
    getXValue,
    getYValue,
    getShare,
    getValueSpan,
    getWholeRange,
    isPartOfWhole,
    isRangeItem,
} from './scale';
import {
    formatShare,
    formatValue,
    getAxisValueFormatter,
    ValueStyle,
} from './format';
import {
    alignSeries,
    getAllItems,
    GridSeries,
    ItemPosition,
    SeriesGrid,
} from './series';
import { ChartTheme } from './theme';

type SeriesOption =
    | BarSeriesOption
    | GaugeSeriesOption
    | LineSeriesOption
    | PieSeriesOption
    | ScatterSeriesOption;

export type ChartOption = ComposeOption<
    | SeriesOption
    | GridComponentOption
    | PolarComponentOption
    | TooltipComponentOption
>;

/**
 * What the chart draws, from the props of `limel-chart`.
 */
export interface ChartSettings extends ValueStyle {
    /**
     * The items, each with its color resolved by the theme. A chart that
     * draws series leaves them out.
     */
    items: ChartItem[];
    /**
     * The series, which are drawn instead of the items when the type can
     * draw series. The color of each series, and of each of its items, is
     * resolved by the theme.
     */
    series?: ChartSeries[];
    orientation: 'landscape' | 'portrait';
    maxValue?: number;
    axisIncrement?: number;
    displayAxisLabels: boolean;
    /** The name of the axis that has the items, or the first values of a scatter chart. */
    itemsLabel: string;
    /** The name of the axis that has the values, or the second values of a scatter chart. */
    valuesLabel: string;
    displayItemText: boolean;
    displayItemValue: boolean;
    displayItemPercentage: boolean;
}

/**
 * The ECharts option for a chart, and where its items are drawn.
 */
export interface ChartDrawing {
    option: ChartOption;
    /**
     * The series of ECharts that draws the items of each series, or the
     * items of a chart without series, when the items are not series of
     * their own.
     */
    seriesIndexes: number[];
    /**
     * The series of the chart that each series of ECharts draws a part of.
     * A series of ECharts that is not in it draws the first series.
     */
    partsOfSeries?: number[];
    /** Whether every item is a series of its own, as in a proportion bar. */
    itemsAreSeries: boolean;
    /** The axis that shows the texts of the items, when they are shown on one. */
    itemTextAxis?: 'xAxis' | 'yAxis';
    /** The range of the value axis, when the items are drawn on axes. */
    valueRange?: AxisRange;
}

/**
 * The position of an item within the drawn series.
 */
export interface ItemLocation {
    seriesIndex: number;
    dataIndex: number;
}

const DOT_SIZE = 8;
const LINE_DOT_SIZE = 6;
const CONNECTOR_WIDTH = 2;
const DIMMED_OPACITY = 0.4;
const AREA_OPACITY = 0.4;
const SERIES_AREA_OPACITY = 0.15;
const PADDING = 8;
const NPS_MIN = -100;
const NPS_MAX = 100;
const NPS_START_ANGLE = 200;
const NPS_END_ANGLE = -20;
const NPS_THRESHOLDS = [0.5, 0.65, 0.85, 1];
const NPS_ARC_WIDTH = 16;
const ITEM_TEXT_MIN_WIDTH = 40;
const ITEM_TEXT_GAP = 4;
const ITEM_TEXT_LINE_HEIGHT = 14;

const SWATCH = {
    width: '0.625rem',
    height: '0.625rem',
    'border-radius': '0.125rem',
};
const SWATCH_SHAPES: Partial<Record<DrawnChartType, Record<string, string>>> = {
    line: { height: '0.125rem' },
    dot: { 'border-radius': '50%' },
};

const emphasis = { focus: 'self' } as const;
const blur = { itemStyle: { opacity: DIMMED_OPACITY } };
const hidden = { show: false };

/**
 * Builds the ECharts option for the chart.
 * @param settings - what to draw
 * @param theme - the colors, sizes and font to draw it with
 * @param itemSpace - the distance between two items on the axis, in pixels,
 * when it is known from an earlier drawing
 */
export function drawChart(
    settings: ChartSettings,
    theme: ChartTheme,
    itemSpace?: number
): ChartDrawing {
    const drawn = getDrawnSettings(settings);
    const grid = getSeriesGrid(drawn);
    const drawing = drawSeries(drawn, grid, theme, itemSpace);

    return {
        ...drawing,
        option: {
            animation: theme.animate,
            textStyle: { fontFamily: theme.fontFamily, color: theme.textColor },
            tooltip: {
                appendTo: 'body',
                backgroundColor: theme.surfaceColor,
                borderColor: theme.axisLineColor,
                textStyle: { color: theme.textColor },
                ...(drawn.series
                    ? getCategoryTooltipOption(drawn, grid, theme)
                    : {
                          trigger: 'item',
                          formatter: (params) =>
                              getTooltip(
                                  drawn,
                                  findItem(
                                      drawing,
                                      params as Partial<ItemLocation>
                                  ).index
                              ),
                      }),
            },
            ...drawing.option,
        },
    };
}

/**
 * The item drawn at a position, if an item is drawn there. A position in a
 * series of ECharts that draws no items of its own, such as the invisible
 * column of an item, belongs to the first series.
 * @param drawing - the drawing of the chart
 * @param location - a position within the drawn series
 */
export function findItem(
    drawing: Omit<ChartDrawing, 'option'>,
    location: Partial<ItemLocation>
): ItemPosition {
    if (drawing.itemsAreSeries) {
        return { series: 0, index: location.seriesIndex };
    }

    return {
        series: drawing.partsOfSeries?.[location.seriesIndex] ?? 0,
        index: location.dataIndex,
    };
}

/**
 * Where an item is drawn, for highlighting it and showing its tooltip.
 * @param drawing - the drawing of the chart
 * @param position - where the item is among the series
 */
export function locateItem(
    drawing: Omit<ChartDrawing, 'option'>,
    position: ItemPosition
): ItemLocation {
    if (drawing.itemsAreSeries) {
        return { seriesIndex: position.index, dataIndex: 0 };
    }

    return {
        seriesIndex: drawing.seriesIndexes[position.series],
        dataIndex: position.index,
    };
}

type ItemsAndSeries = Pick<ChartSettings, 'type' | 'items' | 'series'>;

/**
 * The series that the chart draws: its series, when its type can draw them.
 * @param settings - what the chart is given
 */
export function getDrawnSeries(
    settings: Pick<ChartSettings, 'type' | 'series'>
): ChartSeries[] | undefined {
    if (!settings.series?.length || !canDrawSeries(settings.type)) {
        return;
    }

    return settings.series;
}

/**
 * The series whose items the chart draws as its items: its first series,
 * when its type cannot draw series and it has no items.
 * @param settings - what the chart is given
 */
export function getSeriesOfDrawnItems(
    settings: ItemsAndSeries
): ChartSeries | undefined {
    if (getDrawnSeries(settings) || settings.items?.length) {
        return;
    }

    return settings.series?.[0];
}

/**
 * The items that the chart draws when it draws no series: its items, or the
 * items of its first series when it has no items.
 * @param settings - what the chart is given
 */
export function getDrawnItems(settings: ItemsAndSeries): ChartItem[] {
    if (getDrawnSeries(settings)) {
        return [];
    }

    return getSeriesOfDrawnItems(settings)?.items ?? settings.items ?? [];
}

function getDrawnSettings(settings: ChartSettings): ChartSettings {
    return {
        ...settings,
        items: getDrawnItems(settings),
        series: getDrawnSeries(settings),
    };
}

/**
 * The series that the chart draws lined up by category, or the items it
 * draws as the only series when it draws no series.
 * @param settings - what the chart is given
 */
export function getSeriesGrid(settings: ItemsAndSeries): SeriesGrid {
    return alignSeries(
        getDrawnSeries(settings) ?? [
            { text: '', items: getDrawnItems(settings) },
        ]
    );
}

/**
 * The style of the marker of a series, in the legend and in the tooltip: a
 * square for bars and areas, a line for lines, and a dot for dots.
 * @param type - the chart type
 * @param color - the color of the series
 */
export function getSwatchStyle(
    type: DrawnChartType,
    color = ''
): Record<string, string> {
    return { ...SWATCH, ...SWATCH_SHAPES[type], 'background-color': color };
}

/**
 * Shows the text of every item on the axis, cut short to the space of the
 * item, so that no text runs into the next one. When the items are too close
 * together for that, only some of the texts are shown, as many as fit.
 * @param drawing - the drawing of the chart
 * @param itemSpace - the distance between two items on the axis, in pixels
 */
export function fitItemTexts(
    drawing: Pick<ChartDrawing, 'itemTextAxis'>,
    itemSpace: number
): ChartOption {
    const axis = drawing.itemTextAxis;

    return {
        [axis]: [{ axisLabel: getItemTextLayout(axis, itemSpace) }],
    } as ChartOption;
}

function getItemTextLayout(
    axis: ChartDrawing['itemTextAxis'],
    itemSpace: number
) {
    if (axis === 'yAxis') {
        const fits = itemSpace >= ITEM_TEXT_LINE_HEIGHT;

        return { interval: fits ? 0 : 'auto' } as const;
    }

    if (itemSpace < ITEM_TEXT_MIN_WIDTH) {
        return { interval: 'auto', overflow: 'none' } as const;
    }

    return {
        interval: 0,
        width: itemSpace - ITEM_TEXT_GAP,
        overflow: 'truncate',
        ellipsis: '…',
    } as const;
}

/**
 * The text of an item, with its share of the whole for charts of parts when
 * `displayItemPercentage` is set.
 * @param settings - what the chart draws
 * @param index - the index of the item
 */
export function getItemLabel(
    settings: Pick<
        ChartSettings,
        'items' | 'type' | 'maxValue' | 'displayItemPercentage' | 'language'
    >,
    index: number
): string {
    const item = settings.items[index];
    if (!settings.displayItemPercentage || !isPartOfWhole(settings.type)) {
        return item.text;
    }

    const whole = getWholeRange(settings.items, settings.maxValue);
    const share = formatShare(getShare(item, whole), settings.language);

    return `${item.text} (${share})`;
}

/**
 * The tooltip of an item, as HTML: its label and its value.
 * @param settings - what the chart draws
 * @param index - the index of the item
 */
export function getTooltip(settings: ChartSettings, index: number): string {
    const item = settings.items[index];
    if (!item) {
        return '';
    }

    return [getItemLabel(settings, index), formatValue(item, settings)]
        .map((text) => format.encodeHTML(text))
        .join('<br/>');
}

/**
 * The tooltip of a category of a chart with series, as HTML: its text, and
 * the name and value of each series that has an item there.
 * @param grid - the series of the chart, lined up by category
 * @param style - how the chart writes values
 * @param index - the index of the category
 */
export function getCategoryTooltip(
    grid: SeriesGrid,
    style: ValueStyle,
    index: number
): string {
    const category = grid.categories[index];
    if (category === undefined) {
        return '';
    }

    const lines = grid.series
        .filter((series) => series.items[index] !== undefined)
        .map((series) => {
            const item = series.items[index];

            return getTooltipLine(
                getSwatch(style.type, item.color ?? series.color),
                series.text,
                formatValue(item, style)
            );
        });

    return [`<div>${format.encodeHTML(category)}</div>`, ...lines].join('');
}

function getTooltipLine(swatch: string, name: string, value: string): string {
    return `<div style="display:flex;justify-content:space-between;gap:1rem"><span>${swatch}${format.encodeHTML(name)}</span><span>${format.encodeHTML(value)}</span></div>`;
}

function getSwatch(type: DrawnChartType, color = ''): string {
    const style = {
        display: 'inline-block',
        'vertical-align': 'middle',
        'margin-right': '0.375rem',
        ...getSwatchStyle(type, format.encodeHTML(color)),
    };
    const declarations = Object.entries(style).map(
        ([property, value]) => `${property}:${value}`
    );

    return `<span style="${declarations.join(';')}"></span>`;
}

function getCategoryTooltipOption(
    settings: ChartSettings,
    grid: SeriesGrid,
    theme: ChartTheme
): TooltipComponentOption {
    return {
        trigger: 'axis',
        axisPointer:
            settings.type === 'bar'
                ? {
                      type: 'shadow',
                      shadowStyle: { color: theme.axisLineColor, opacity: 0.2 },
                  }
                : { type: 'line', lineStyle: { color: theme.axisLineColor } },
        formatter: (params) => {
            const [first] = [params].flat();

            return getCategoryTooltip(grid, settings, first?.dataIndex);
        },
    };
}

function drawSeries(
    settings: ChartSettings,
    grid: SeriesGrid,
    theme: ChartTheme,
    itemSpace?: number
): ChartDrawing {
    switch (settings.type) {
        case 'pie':
        case 'doughnut': {
            return drawPie(settings, theme);
        }
        case 'proportion-bar': {
            return drawProportionBar(settings, theme);
        }
        case 'ring': {
            return drawRing(settings, theme);
        }
        case 'scatter': {
            return drawScatter(settings, theme);
        }
        case 'nps': {
            return drawNps(settings, theme);
        }
        default: {
            return drawOnAxes(settings, grid, theme, itemSpace);
        }
    }
}

function drawOnAxes(
    settings: ChartSettings,
    grid: SeriesGrid,
    theme: ChartTheme,
    itemSpace?: number
): ChartDrawing {
    const { orientation } = settings;
    const range = getValueRange(settings, grid);
    const itemTextAxis = getItemTextAxis(settings, grid);
    const categoryAxis = {
        ...getCategoryAxis(settings, grid),
        axisLabel: {
            show: settings.displayItemText,
            color: theme.textColor,
            ...(itemTextAxis &&
                itemSpace &&
                getItemTextLayout(itemTextAxis, itemSpace)),
        },
        axisTick: hidden,
        axisLine: { lineStyle: { color: theme.axisLineColor } },
        ...getAxisName(settings, settings.itemsLabel, theme),
    };
    const valueAxis = getValueAxis(
        range,
        getAxisName(settings, settings.valuesLabel, theme),
        settings,
        theme
    );
    const { series, seriesIndexes, partsOfSeries } = getAxisSeries(
        settings,
        grid,
        theme
    );
    const option: ChartOption = {
        grid: getGrid(theme),
        xAxis: orientation === 'landscape' ? categoryAxis : valueAxis,
        yAxis: orientation === 'landscape' ? valueAxis : categoryAxis,
        series: series,
    };
    const hasColumns = settings.type !== 'bar' && !settings.series;

    return {
        seriesIndexes: seriesIndexes,
        partsOfSeries: partsOfSeries,
        itemsAreSeries: false,
        itemTextAxis: itemTextAxis,
        valueRange: range,
        option: hasColumns ? withColumns(option, settings, grid) : option,
    };
}

function getValueRange(settings: ChartSettings, grid: SeriesGrid): AxisRange {
    const items = getAllItems(grid);
    if (settings.valueFormat === 'date') {
        return getDateRange(
            items.flatMap((item) => [
                getMinimumValue(item),
                getMaximumValue(item),
            ]),
            settings.maxValue
        );
    }

    return getAxisRange(items, settings.maxValue, settings.axisIncrement);
}

function getCategoryAxis(settings: ChartSettings, grid: SeriesGrid) {
    return {
        type: 'category' as const,
        data: grid.categories,
        inverse: settings.orientation === 'portrait',
    };
}

function getItemTextAxis(
    settings: ChartSettings,
    grid: SeriesGrid
): ChartDrawing['itemTextAxis'] {
    if (!settings.displayItemText || grid.categories.length < 2) {
        return;
    }

    return settings.orientation === 'landscape' ? 'xAxis' : 'yAxis';
}

// Dots and lines are small targets, so each item also gets an invisible
// column across the whole plot that shows its tooltip and takes its clicks.
// The columns have axes of their own, so they are not laid out next to the
// bars that draw ranges.
function withColumns(
    option: ChartOption,
    settings: ChartSettings,
    grid: SeriesGrid
) {
    const { items, orientation } = settings;
    const categoryAxis = { ...getCategoryAxis(settings, grid), show: false };
    const valueAxis = { type: 'value' as const, min: 0, max: 1, show: false };
    const columns: BarSeriesOption = {
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        barWidth: '100%',
        itemStyle: { color: 'transparent' },
        data: items.map(() => 1),
        cursor: getSeriesCursor(items),
        emphasis: { disabled: true },
    };
    const landscape = orientation === 'landscape';

    return {
        ...option,
        xAxis: [option.xAxis, landscape ? categoryAxis : valueAxis],
        yAxis: [option.yAxis, landscape ? valueAxis : categoryAxis],
        series: [...(option.series as SeriesOption[]), columns],
    } as ChartOption;
}

function getAxisSeries(
    settings: ChartSettings,
    grid: SeriesGrid,
    theme: ChartTheme
): Pick<ChartDrawing, 'seriesIndexes' | 'partsOfSeries'> & {
    series: SeriesOption[];
} {
    const series: SeriesOption[] = [];
    const seriesIndexes: number[] = [];
    const partsOfSeries: number[] = [];
    for (const [index, current] of grid.series.entries()) {
        const drawn = drawItemSeries(settings, current, index, theme);
        seriesIndexes.push(series.length + drawn.seriesIndex);
        series.push(...drawn.series);
        partsOfSeries.push(...drawn.series.map(() => index));
    }

    return {
        series: series,
        seriesIndexes: seriesIndexes,
        partsOfSeries: partsOfSeries,
    };
}

function drawItemSeries(
    settings: ChartSettings,
    series: GridSeries,
    index: number,
    theme: ChartTheme
): { series: SeriesOption[]; seriesIndex: number } {
    if (settings.type === 'line' || settings.type === 'area') {
        return getLineSeries(settings, series, index, theme);
    }

    if (settings.type === 'dot') {
        return getDotSeries(settings, series, index, theme);
    }

    return getBarSeries(settings, series, index, theme);
}

function getBarSeries(
    settings: ChartSettings,
    series: GridSeries,
    index: number,
    theme: ChartTheme
): { series: SeriesOption[]; seriesIndex: number } {
    const { items } = series;
    const bars: BarSeriesOption = {
        type: 'bar',
        data: items.map((item) =>
            item
                ? {
                      value: getValueSpan(item),
                      itemStyle: {
                          color: item.color,
                          borderRadius: theme.itemBorderRadius,
                      },
                  }
                : null
        ),
        label: getValueLabel(settings, series, theme),
        cursor: getSeriesCursor(items),
        emphasis: emphasis,
        blur: blur,
    };

    if (!hasRanges(items)) {
        return { series: [bars], seriesIndex: 0 };
    }

    return {
        series: [
            {
                type: 'bar',
                ...getRangeBase(index),
                data: getRangeStarts(items),
            },
            { ...bars, ...getRangeStack(index) },
        ],
        seriesIndex: 1,
    };
}

function getDotSeries(
    settings: ChartSettings,
    series: GridSeries,
    index: number,
    theme: ChartTheme
): { series: SeriesOption[]; seriesIndex: number } {
    const { items } = series;
    const { orientation } = settings;
    const point = (category: number, value: number) =>
        orientation === 'landscape' ? [category, value] : [value, category];
    const ends: ScatterSeriesOption = {
        type: 'scatter',
        symbolSize: DOT_SIZE,
        data: items.map((item, category) =>
            item
                ? {
                      value: point(category, getMaximumValue(item)),
                      itemStyle: { color: item.color },
                  }
                : null
        ),
        label: getValueLabel(settings, series, theme),
        cursor: getSeriesCursor(items),
        emphasis: emphasis,
        blur: blur,
    };

    if (!hasRanges(items)) {
        return { series: [ends], seriesIndex: 0 };
    }

    const connectors: BarSeriesOption = {
        type: 'bar',
        ...getRangeStack(index),
        cursor: getSeriesCursor(items),
        emphasis: { disabled: true },
        barWidth: CONNECTOR_WIDTH,
        barGap: '-100%',
        data: items.map((item) =>
            item && isRangeItem(item)
                ? {
                      value: getValueSpan(item),
                      itemStyle: { color: item.color },
                  }
                : null
        ),
    };
    const starts: ScatterSeriesOption = {
        type: 'scatter',
        cursor: getSeriesCursor(items),
        emphasis: { disabled: true },
        symbolSize: DOT_SIZE,
        data: items.map((item, category) =>
            item && isRangeItem(item)
                ? {
                      value: point(category, getMinimumValue(item)),
                      itemStyle: { color: item.color },
                  }
                : null
        ),
    };

    return {
        series: [
            {
                type: 'bar',
                ...getRangeBase(index),
                barGap: '-100%',
                data: getRangeStarts(items),
            },
            connectors,
            starts,
            ends,
        ],
        seriesIndex: 3,
    };
}

function getLineSeries(
    settings: ChartSettings,
    series: GridSeries,
    index: number,
    theme: ChartTheme
): { series: SeriesOption[]; seriesIndex: number } {
    const { items } = series;
    const color = series.color ?? theme.lineColor;
    const area = settings.type === 'area';
    const line: LineSeriesOption = {
        type: 'line',
        color: color,
        symbol: 'circle',
        symbolSize: LINE_DOT_SIZE,
        ...(settings.series &&
            hasClickableItems(items) && {
                showAllSymbol: true,
                labelLayout: { hideOverlap: true },
            }),
        data: items.map((item) =>
            item
                ? {
                      value: getValueSpan(item),
                      itemStyle: { color: item.color },
                  }
                : null
        ),
        areaStyle: area
            ? {
                  color: color,
                  opacity:
                      settings.series?.length > 1
                          ? SERIES_AREA_OPACITY
                          : AREA_OPACITY,
              }
            : undefined,
        label: getValueLabel(settings, series, theme),
        cursor: getSeriesCursor(items),
        emphasis: emphasis,
        blur: blur,
    };

    if (!hasRanges(items)) {
        return { series: [line], seriesIndex: 0 };
    }

    const base: LineSeriesOption = {
        type: 'line',
        ...getRangeBase(index),
        symbol: 'none',
        color: color,
        lineStyle: { opacity: area ? 0 : 1 },
        data: getRangeStarts(items),
    };

    return {
        series: [base, { ...line, ...getRangeStack(index) }],
        seriesIndex: 1,
    };
}

function hasClickableItems(items: Array<ChartItem | undefined>): boolean {
    return items.some((item) => item?.clickable);
}

function hasRanges(items: Array<ChartItem | undefined>): boolean {
    return items.some((item) => item && isRangeItem(item));
}

// A range is drawn as a stack of an invisible part from zero to its start,
// and a visible part from its start to its end. Items that are not ranges
// start at zero. Each series has a stack of its own.
function getRangeStack(index: number) {
    return { stack: `range${index}`, stackStrategy: 'all' } as const;
}

function getRangeBase(index: number) {
    return {
        ...getRangeStack(index),
        silent: true,
        tooltip: hidden,
        emphasis: { disabled: true },
        itemStyle: { color: 'transparent' },
    };
}

function getRangeStarts(
    items: Array<ChartItem | undefined>
): Array<number | null> {
    return items.map((item) => {
        if (!item) {
            return null;
        }

        return isRangeItem(item) ? getMinimumValue(item) : 0;
    });
}

function drawScatter(settings: ChartSettings, theme: ChartTheme): ChartDrawing {
    const { items } = settings;
    const ranges =
        settings.valueFormat === 'date'
            ? {
                  x: getDateRange(items.map((item) => getXValue(item))),
                  y: getDateRange(items.map((item) => getYValue(item))),
              }
            : getScatterRanges(items);
    const landscape = settings.orientation === 'landscape';
    const firstAxis = getValueAxis(
        ranges.x,
        getAxisName(settings, settings.itemsLabel, theme),
        settings,
        theme
    );
    const secondAxis = getValueAxis(
        ranges.y,
        getAxisName(settings, settings.valuesLabel, theme),
        settings,
        theme
    );
    const scatter: ScatterSeriesOption = {
        type: 'scatter',
        symbolSize: theme.scatterItemSize,
        data: items.map((item) => {
            const first = getXValue(item);
            const second = getYValue(item);

            return {
                value: landscape ? [first, second] : [second, first],
                itemStyle: { color: item.color },
            };
        }),
        label: {
            show: settings.displayItemText || settings.displayItemValue,
            position: 'top',
            ...getLabelStyle(theme),
            formatter: ({ dataIndex }) =>
                getPointLabel(settings, items[dataIndex]),
        },
        cursor: getSeriesCursor(items),
        emphasis: emphasis,
        blur: blur,
    };

    return {
        seriesIndexes: [0],
        itemsAreSeries: false,
        option: {
            grid: getGrid(theme),
            xAxis: landscape ? firstAxis : secondAxis,
            yAxis: landscape ? secondAxis : { ...firstAxis, inverse: true },
            series: [scatter],
        },
    };
}

function drawPie(settings: ChartSettings, theme: ChartTheme): ChartDrawing {
    const { items } = settings;
    const whole = getWholeRange(items, settings.maxValue).totalRange;
    const sum = items.reduce((total, item) => total + getValueSpan(item), 0);
    const data: PieSeriesOption['data'] = items.map((item) => ({
        value: getValueSpan(item),
        name: item.text,
        itemStyle: { color: item.color },
    }));

    if (whole > sum) {
        data.push({
            value: whole - sum,
            itemStyle: { color: theme.backgroundColor },
            emphasis: { disabled: true },
            cursor: getCursor(false),
        });
    }

    const innerRadius = settings.type === 'doughnut' ? '50%' : 0;

    return {
        seriesIndexes: [0],
        itemsAreSeries: false,
        option: {
            series: [
                {
                    type: 'pie',
                    radius: [innerRadius, '90%'],
                    startAngle: 90,
                    label: hidden,
                    labelLine: hidden,
                    itemStyle: {
                        borderColor: theme.dividerColor,
                        borderWidth: 1,
                    },
                    data: data,
                    cursor: getSeriesCursor(items),
                    emphasis: { ...emphasis, scale: false },
                    blur: blur,
                },
            ],
        },
    };
}

function drawProportionBar(
    settings: ChartSettings,
    theme: ChartTheme
): ChartDrawing {
    const { items } = settings;
    const whole = getWholeRange(items, settings.maxValue).totalRange;
    const valueAxis = {
        type: 'value' as const,
        min: 0,
        max: whole,
        show: false,
    };
    const categoryAxis = { type: 'category' as const, data: [''], show: false };
    const landscape = settings.orientation === 'landscape';

    return {
        seriesIndexes: [0],
        itemsAreSeries: true,
        option: {
            backgroundColor: theme.backgroundColor,
            grid: { left: 0, right: 0, top: 0, bottom: 0 },
            xAxis: landscape ? valueAxis : categoryAxis,
            yAxis: landscape ? categoryAxis : valueAxis,
            series: items.map((item): BarSeriesOption => ({
                type: 'bar',
                stack: 'whole',
                barWidth: '100%',
                cursor: getCursor(item.clickable),
                data: [getValueSpan(item)],
                itemStyle: {
                    color: item.color,
                    borderRadius: theme.itemBorderRadius,
                    borderColor: theme.dividerColor,
                    borderWidth: 1,
                },
                emphasis: emphasis,
                blur: blur,
            })),
        },
    };
}

function drawRing(settings: ChartSettings, theme: ChartTheme): ChartDrawing {
    const { items } = settings;
    const whole = getWholeRange(items, settings.maxValue).totalRange;

    return {
        seriesIndexes: [0],
        itemsAreSeries: false,
        option: {
            polar: { radius: ['20%', '90%'] },
            angleAxis: {
                type: 'value',
                max: whole,
                startAngle: 90,
                show: false,
            },
            radiusAxis: {
                type: 'category',
                data: items.map((item) => item.text),
                inverse: true,
                show: false,
            },
            series: [
                {
                    type: 'bar',
                    coordinateSystem: 'polar',
                    showBackground: true,
                    backgroundStyle: { color: theme.backgroundColor },
                    data: items.map((item) => ({
                        value: getValueSpan(item),
                        itemStyle: { color: item.color },
                    })),
                    cursor: getSeriesCursor(items),
                    emphasis: emphasis,
                    blur: blur,
                },
            ],
        },
    };
}

function drawNps(settings: ChartSettings, theme: ChartTheme): ChartDrawing {
    const { items } = settings;

    return {
        seriesIndexes: [0],
        itemsAreSeries: false,
        option: {
            series: [
                {
                    type: 'gauge',
                    min: NPS_MIN,
                    max: NPS_MAX,
                    startAngle: NPS_START_ANGLE,
                    endAngle: NPS_END_ANGLE,
                    radius: '90%',
                    axisLine: {
                        lineStyle: {
                            width: NPS_ARC_WIDTH,
                            color: NPS_THRESHOLDS.map((threshold, index) => [
                                threshold,
                                theme.npsColors[index],
                            ]),
                        },
                    },
                    splitLine: hidden,
                    axisTick: hidden,
                    axisLabel: hidden,
                    pointer: { width: 6, length: '70%' },
                    anchor: {
                        show: true,
                        size: 12,
                        itemStyle: { color: theme.textColor },
                    },
                    title: hidden,
                    detail: hidden,
                    data: items.map((item) => ({
                        value: getMaximumValue(item),
                        name: item.text,
                        itemStyle: { color: item.color },
                    })),
                    cursor: getSeriesCursor(items),
                    emphasis: emphasis,
                    blur: blur,
                },
                {
                    type: 'pie',
                    z: 1,
                    silent: true,
                    radius: [0, '90%'],
                    startAngle: NPS_START_ANGLE,
                    endAngle: NPS_END_ANGLE,
                    label: hidden,
                    labelLine: hidden,
                    tooltip: hidden,
                    data: [
                        {
                            value: 1,
                            itemStyle: { color: theme.backgroundColor },
                        },
                    ],
                },
            ],
        },
    };
}

function getGrid(theme: ChartTheme): GridComponentOption {
    return {
        left: PADDING,
        right: PADDING,
        top: PADDING,
        bottom: PADDING,
        outerBoundsMode: 'same',
        outerBoundsContain: 'all',
        show: true,
        backgroundColor: theme.backgroundColor,
        borderWidth: 0,
    };
}

function getValueAxis(
    range: AxisRange,
    name: ReturnType<typeof getAxisName>,
    settings: ChartSettings,
    theme: ChartTheme
) {
    const dates = settings.valueFormat === 'date' && getDateTicks(range);
    const ticks = dates && { customValues: dates.values };

    return {
        type: 'value' as const,
        min: range.minValue,
        max: range.maxValue,
        interval: dates ? undefined : range.increment,
        axisLabel: {
            show: true,
            color: theme.textColor,
            formatter: getAxisValueFormatter(
                range,
                settings,
                dates || undefined
            ),
            ...ticks,
        },
        ...(ticks && { axisTick: ticks }),
        axisLine: { lineStyle: { color: theme.axisLineColor } },
        splitLine: { lineStyle: { color: theme.axisLineColor } },
        ...name,
    };
}

function getAxisName(settings: ChartSettings, name: string, theme: ChartTheme) {
    if (!settings.displayAxisLabels) {
        return {};
    }

    return {
        name: name,
        nameLocation: 'middle' as const,
        nameTextStyle: { color: theme.textColor },
    };
}

function getValueLabel(
    settings: ChartSettings,
    series: Pick<GridSeries, 'items'>,
    theme: ChartTheme
) {
    return {
        show: settings.displayItemValue,
        position: settings.orientation === 'landscape' ? 'top' : 'right',
        ...getLabelStyle(theme),
        formatter: ({ dataIndex }: { dataIndex: number }) =>
            formatValue(series.items[dataIndex], settings),
    } as const;
}

function getLabelStyle(theme: ChartTheme) {
    return { color: theme.textColor, textBorderWidth: 0 };
}

function getPointLabel(settings: ChartSettings, item: ChartItem): string {
    const parts = [];
    if (settings.displayItemText) {
        parts.push(item.text);
    }

    if (settings.displayItemValue) {
        parts.push(formatValue(item, settings));
    }

    return parts.join(' ');
}

function getSeriesCursor(items: Array<ChartItem | undefined>): string {
    return getCursor(hasClickableItems(items));
}

function getCursor(clickable: boolean): string {
    return clickable ? 'pointer' : 'default';
}
