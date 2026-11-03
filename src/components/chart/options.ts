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
import { ChartItem } from './chart.types';
import {
    AxisRange,
    getAxisRange,
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
    /** The items, each with its color resolved by the theme. */
    items: ChartItem[];
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
    /** The series that draws the items, when they are not series of their own. */
    seriesIndex: number;
    /** Whether every item is a series of its own, as in a proportion bar. */
    itemsAreSeries: boolean;
    /** The axis that shows the texts of the items, when they are shown on one. */
    itemTextAxis?: 'xAxis' | 'yAxis';
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
    const drawing = drawSeries(settings, theme, itemSpace);

    return {
        ...drawing,
        option: {
            animation: theme.animate,
            textStyle: { fontFamily: theme.fontFamily, color: theme.textColor },
            tooltip: {
                trigger: 'item',
                appendTo: 'body',
                backgroundColor: theme.surfaceColor,
                borderColor: theme.axisLineColor,
                textStyle: { color: theme.textColor },
                formatter: (params) =>
                    getTooltip(
                        settings,
                        getItemIndex(drawing, params as Partial<ItemLocation>)
                    ),
            },
            ...drawing.option,
        },
    };
}

/**
 * The index of the item drawn at a position, if an item is drawn there.
 * @param drawing - the drawing of the chart
 * @param location - a position within the drawn series
 */
export function getItemIndex(
    drawing: Omit<ChartDrawing, 'option'>,
    location: Partial<ItemLocation>
): number {
    return drawing.itemsAreSeries ? location.seriesIndex : location.dataIndex;
}

/**
 * Where an item is drawn, for highlighting it and showing its tooltip.
 * @param drawing - the drawing of the chart
 * @param index - the index of the item
 */
export function locateItem(
    drawing: Omit<ChartDrawing, 'option'>,
    index: number
): ItemLocation {
    if (drawing.itemsAreSeries) {
        return { seriesIndex: index, dataIndex: 0 };
    }

    return { seriesIndex: drawing.seriesIndex, dataIndex: index };
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

function drawSeries(
    settings: ChartSettings,
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
            return drawOnAxes(settings, theme, itemSpace);
        }
    }
}

function drawOnAxes(
    settings: ChartSettings,
    theme: ChartTheme,
    itemSpace?: number
): ChartDrawing {
    const { items, orientation } = settings;
    const range = getAxisRange(
        items,
        settings.maxValue,
        settings.axisIncrement
    );
    const itemTextAxis = getItemTextAxis(settings);
    const categoryAxis = {
        ...getCategoryAxis(settings),
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
    const { series, seriesIndex } = getAxisSeries(settings, theme);
    const option: ChartOption = {
        grid: getGrid(theme),
        xAxis: orientation === 'landscape' ? categoryAxis : valueAxis,
        yAxis: orientation === 'landscape' ? valueAxis : categoryAxis,
        series: series,
    };

    return {
        seriesIndex: seriesIndex,
        itemsAreSeries: false,
        itemTextAxis: itemTextAxis,
        option:
            settings.type === 'bar' ? option : withColumns(option, settings),
    };
}

function getCategoryAxis(settings: ChartSettings) {
    return {
        type: 'category' as const,
        data: settings.items.map((item) => item.text),
        inverse: settings.orientation === 'portrait',
    };
}

function getItemTextAxis(
    settings: ChartSettings
): ChartDrawing['itemTextAxis'] {
    if (!settings.displayItemText || settings.items.length < 2) {
        return;
    }

    return settings.orientation === 'landscape' ? 'xAxis' : 'yAxis';
}

// Dots and lines are small targets, so each item also gets an invisible
// column across the whole plot that shows its tooltip and takes its clicks.
// The columns have axes of their own, so they are not laid out next to the
// bars that draw ranges.
function withColumns(option: ChartOption, settings: ChartSettings) {
    const { items, orientation } = settings;
    const categoryAxis = { ...getCategoryAxis(settings), show: false };
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
    theme: ChartTheme
): { series: SeriesOption[]; seriesIndex: number } {
    if (settings.type === 'line' || settings.type === 'area') {
        return getLineSeries(settings, theme);
    }

    if (settings.type === 'dot') {
        return getDotSeries(settings, theme);
    }

    return getBarSeries(settings, theme);
}

function getBarSeries(
    settings: ChartSettings,
    theme: ChartTheme
): { series: SeriesOption[]; seriesIndex: number } {
    const { items } = settings;
    const bars: BarSeriesOption = {
        type: 'bar',
        data: items.map((item) => ({
            value: getValueSpan(item),
            itemStyle: {
                color: item.color,
                borderRadius: theme.itemBorderRadius,
            },
        })),
        label: getValueLabel(settings, theme),
        cursor: getSeriesCursor(items),
        emphasis: emphasis,
        blur: blur,
    };

    if (items.every((item) => !isRangeItem(item))) {
        return { series: [bars], seriesIndex: 0 };
    }

    return {
        series: [
            { type: 'bar', ...rangeBase, data: getRangeStarts(items) },
            { ...bars, ...stacked },
        ],
        seriesIndex: 1,
    };
}

function getDotSeries(
    settings: ChartSettings,
    theme: ChartTheme
): { series: SeriesOption[]; seriesIndex: number } {
    const { items, orientation } = settings;
    const point = (index: number, value: number) =>
        orientation === 'landscape' ? [index, value] : [value, index];
    const ends: ScatterSeriesOption = {
        type: 'scatter',
        symbolSize: DOT_SIZE,
        data: items.map((item, index) => ({
            value: point(index, getMaximumValue(item)),
            itemStyle: { color: item.color },
        })),
        label: getValueLabel(settings, theme),
        cursor: getSeriesCursor(items),
        emphasis: emphasis,
        blur: blur,
    };

    if (items.every((item) => !isRangeItem(item))) {
        return { series: [ends], seriesIndex: 0 };
    }

    const connectors: BarSeriesOption = {
        type: 'bar',
        ...stacked,
        silent: true,
        barWidth: CONNECTOR_WIDTH,
        data: items.map((item) => ({
            value: isRangeItem(item) ? getValueSpan(item) : null,
            itemStyle: { color: item.color },
        })),
    };
    const starts: ScatterSeriesOption = {
        type: 'scatter',
        silent: true,
        symbolSize: DOT_SIZE,
        data: items.map((item, index) => ({
            value: isRangeItem(item)
                ? point(index, getMinimumValue(item))
                : [null, null],
            itemStyle: { color: item.color },
        })),
    };

    return {
        series: [
            { type: 'bar', ...rangeBase, data: getRangeStarts(items) },
            connectors,
            starts,
            ends,
        ],
        seriesIndex: 3,
    };
}

function getLineSeries(
    settings: ChartSettings,
    theme: ChartTheme
): { series: SeriesOption[]; seriesIndex: number } {
    const { items } = settings;
    const color = theme.lineColor;
    const area = settings.type === 'area';
    const line: LineSeriesOption = {
        type: 'line',
        color: color,
        symbol: 'circle',
        symbolSize: LINE_DOT_SIZE,
        data: items.map((item) => ({
            value: getValueSpan(item),
            itemStyle: { color: item.color },
        })),
        areaStyle: area ? { color: color, opacity: AREA_OPACITY } : undefined,
        label: getValueLabel(settings, theme),
        cursor: getSeriesCursor(items),
        emphasis: emphasis,
        blur: blur,
    };

    if (items.every((item) => !isRangeItem(item))) {
        return { series: [line], seriesIndex: 0 };
    }

    const base: LineSeriesOption = {
        type: 'line',
        ...rangeBase,
        symbol: 'none',
        color: color,
        lineStyle: { opacity: area ? 0 : 1 },
        data: getRangeStarts(items),
    };

    return { series: [base, { ...line, ...stacked }], seriesIndex: 1 };
}

const stacked = { stack: 'range', stackStrategy: 'all' } as const;

// A range is drawn as a stack of an invisible part from zero to its start,
// and a visible part from its start to its end. Items that are not ranges
// start at zero.
const rangeBase = {
    ...stacked,
    silent: true,
    tooltip: hidden,
    emphasis: { disabled: true },
    itemStyle: { color: 'transparent' },
};

function getRangeStarts(items: ChartItem[]): number[] {
    return items.map((item) => (isRangeItem(item) ? getMinimumValue(item) : 0));
}

function drawScatter(settings: ChartSettings, theme: ChartTheme): ChartDrawing {
    const { items } = settings;
    const ranges = getScatterRanges(items);
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
        seriesIndex: 0,
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
        seriesIndex: 0,
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
        seriesIndex: 0,
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
        seriesIndex: 0,
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
        seriesIndex: 0,
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
    return {
        type: 'value' as const,
        min: range.minValue,
        max: range.maxValue,
        interval: range.increment,
        axisLabel: {
            show: true,
            color: theme.textColor,
            formatter: getAxisValueFormatter(range, settings),
        },
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

function getValueLabel(settings: ChartSettings, theme: ChartTheme) {
    return {
        show: settings.displayItemValue,
        position: settings.orientation === 'landscape' ? 'top' : 'right',
        ...getLabelStyle(theme),
        formatter: ({ dataIndex }: { dataIndex: number }) =>
            formatValue(settings.items[dataIndex], settings),
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

function getSeriesCursor(items: ChartItem[]): string {
    return getCursor(items.some((item) => item.clickable));
}

function getCursor(clickable: boolean): string {
    return clickable ? 'pointer' : 'default';
}
