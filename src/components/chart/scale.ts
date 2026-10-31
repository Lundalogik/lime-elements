import { ChartItem, ChartType } from './chart.types';

const PERCENT = 100;
const STEP_COUNT = 10;

/**
 * Types whose items are parts of one whole. They draw no axis, and an item's
 * value or range extent is its share of `maxValue`, or of the combined items.
 */
const WHOLE_TYPES: ReadonlySet<ChartType> = new Set([
    'stacked-bar',
    'pie',
    'doughnut',
    'ring',
]);

export interface AxisRange {
    minValue: number;
    maxValue: number;
    totalRange: number;
    /** Step between adjacent axis lines, used to render the grid. */
    increment: number;
}

/**
 * Whether the items of a chart of this type are parts of one whole.
 * @param type - the chart type
 */
export function isPartOfWhole(type: ChartType): boolean {
    return WHOLE_TYPES.has(type);
}

/**
 * Whether the item has a `[start, end]` range, or an `[x, y]` point in a
 * `scatter` chart, as its value.
 * @param item - the item
 */
export function isRangeItem(
    item: ChartItem
): item is ChartItem<[number, number]> {
    return Array.isArray(item.value);
}

/**
 * The lower end of the item's range, or its value.
 * @param item - the item
 */
export function getMinimumValue(item: ChartItem): number {
    const value = item.value;

    return Array.isArray(value) ? Math.min(...value) : value;
}

/**
 * The upper end of the item's range, or its value.
 * @param item - the item
 */
export function getMaximumValue(item: ChartItem): number {
    const value = item.value;

    return Array.isArray(value) ? Math.max(...value) : value;
}

/**
 * The extent of the item's range, or its value measured from zero.
 * @param item - the item
 */
export function getValueSpan(item: ChartItem): number {
    const startValue = isRangeItem(item) ? getMinimumValue(item) : 0;

    return getMaximumValue(item) - startValue;
}

/**
 * The first value of a `scatter` point.
 * @param item - the point
 */
export function getXValue(item: ChartItem): number {
    return Array.isArray(item.value) ? item.value[0] : item.value;
}

/**
 * The second value of a `scatter` point.
 * @param item - the point
 */
export function getYValue(item: ChartItem): number {
    return Array.isArray(item.value) ? item.value[1] : item.value;
}

/**
 * The value axis of a `bar`, `dot`, `area` or `line` chart. It reaches from
 * zero, or from the smallest value when that is below zero, up to `maxValue`
 * or the largest value. Both ends are rounded outwards to a whole step.
 * Without an `axisIncrement` above zero, the step divides the axis into
 * about ten.
 * @param items - the items in the chart
 * @param maxValue - the requested upper bound, if any
 * @param axisIncrement - the requested step, if any
 */
export function getAxisRange(
    items: ChartItem[],
    maxValue?: number,
    axisIncrement?: number
): AxisRange {
    const maximumValues = items.map((item) => getMaximumValue(item));
    const minRange = Math.min(0, ...items.map((item) => getMinimumValue(item)));
    const finalMaxRange = maxValue ?? Math.max(...maximumValues);
    const increment =
        axisIncrement > 0
            ? axisIncrement
            : getNiceStep(finalMaxRange - minRange);

    return roundOutwards(minRange, finalMaxRange, increment);
}

/**
 * The range of a chart whose items are parts of one whole: `maxValue`
 * when set, otherwise the combined item values or range extents. The value
 * is a scale, not a cap, so the combined size can exceed it. The whole is
 * not rounded to an axis step, since these types draw no axis and an item's
 * size has to be its exact share.
 * @param items - the items in the chart
 * @param maxValue - the whole, if set
 */
export function getWholeRange(
    items: ChartItem[],
    maxValue?: number
): AxisRange {
    const sum = items.reduce((total, item) => total + getValueSpan(item), 0);
    const inferredWhole = sum > 0 ? sum : 1;
    // An explicit zero also falls back to 1, so normalization stays finite.
    const whole = (maxValue ?? inferredWhole) || 1;

    return {
        minValue: 0,
        maxValue: whole,
        totalRange: whole,
        increment: whole,
    };
}

/**
 * The two value axes of a `scatter` chart: `x` for each point's first value
 * and `y` for its second. Each axis derives its own range and step from its
 * own zero-anchored span, so positive, negative, and zero-crossing data all
 * grid sensibly.
 * @param items - the points in the chart
 */
export function getScatterRanges(items: ChartItem[]): {
    x: AxisRange;
    y: AxisRange;
} {
    return {
        x: getZeroAnchoredRange(items.map((item) => getXValue(item))),
        y: getZeroAnchoredRange(items.map((item) => getYValue(item))),
    };
}

/**
 * An item's share of the whole, in percent.
 * @param item - the item
 * @param whole - the range from `getWholeRange`
 */
export function getShare(item: ChartItem, whole: AxisRange): number {
    return (getValueSpan(item) / whole.totalRange) * PERCENT;
}

/**
 * The item's value as text: its `formattedValue` when set, otherwise its
 * value, range, or scatter point.
 * @param item - the item
 * @param type - the chart type
 */
export function formatValue(item: ChartItem, type: ChartType): string {
    const { value, formattedValue } = item;

    if (formattedValue) {
        return formattedValue;
    }

    if (Array.isArray(value)) {
        if (type === 'scatter') {
            return `(${value[0]}, ${value[1]})`;
        }

        return `${value[0]} — ${value[1]}`;
    }

    return `${value}`;
}

function getNiceStep(span: number): number {
    if (span <= 0) {
        return 1;
    }

    const roughStep = span / STEP_COUNT;
    const magnitude = 10 ** Math.floor(Math.log10(roughStep));

    return Math.ceil(roughStep / magnitude) * magnitude;
}

// Both bounds include zero, so a fully-negative axis still shows its origin
// (and zero line).
function getZeroAnchoredRange(values: number[]): AxisRange {
    const minValue = Math.min(0, ...values);
    const maxValue = Math.max(0, ...values);

    return roundOutwards(minValue, maxValue, getNiceStep(maxValue - minValue));
}

function roundOutwards(
    minValue: number,
    maxValue: number,
    increment: number
): AxisRange {
    const lowerEnd = Math.floor(minValue / increment) * increment;
    const upperEnd = Math.ceil(maxValue / increment) * increment;

    return {
        minValue: lowerEnd,
        maxValue: upperEnd,
        totalRange: upperEnd - lowerEnd,
        increment: increment,
    };
}
