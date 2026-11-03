import { ChartItem, ChartType } from './chart.types';

const PERCENT = 100;
const STEP_COUNT = 10;
const DAY = 24 * 60 * 60 * 1000;

/**
 * The most steps that an `axisIncrement` may divide a value axis into.
 */
export const MAX_AXIS_STEPS = 100;

/**
 * The chart types that are drawn. `stacked-bar` is only an old name, which
 * `limel-chart` turns into `proportion-bar` before drawing.
 */
export type DrawnChartType = Exclude<ChartType, 'stacked-bar'>;

/**
 * Types whose items are parts of one whole. They draw no axis, and an item's
 * value or range extent is its share of `maxValue`, or of the combined items.
 */
const WHOLE_TYPES: ReadonlySet<DrawnChartType> = new Set([
    'proportion-bar',
    'pie',
    'doughnut',
    'ring',
]);

const AXIS_INCREMENT_TYPES: ReadonlySet<DrawnChartType> = new Set([
    'bar',
    'dot',
    'area',
    'line',
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
export function isPartOfWhole(type: DrawnChartType): boolean {
    return WHOLE_TYPES.has(type);
}

/**
 * Whether a chart of this type draws its value axis in steps of
 * `axisIncrement`.
 * @param type - the chart type
 */
export function usesAxisIncrement(type: DrawnChartType): boolean {
    return AXIS_INCREMENT_TYPES.has(type);
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
 * Without an `axisIncrement` above zero, or with one that would divide the
 * axis into more than `MAX_AXIS_STEPS` steps, the step divides the axis into
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
    const finalMaxRange = maxValue ?? Math.max(minRange, ...maximumValues);
    const span = finalMaxRange - minRange;
    const increment = isUsableStep(axisIncrement, span)
        ? axisIncrement
        : getNiceStep(span);

    return roundOutwards(minRange, finalMaxRange, increment);
}

/**
 * Whether `value` is a date in milliseconds that `Date` can hold. A date
 * in nanoseconds is not, and neither is a date given as text.
 * @param value - the value to check
 */
export function isDate(value: unknown): value is number {
    return (
        typeof value === 'number' && Number.isFinite(new Date(value).getTime())
    );
}

/**
 * The range of an axis of dates, in milliseconds: from the start of the
 * earliest day to the latest date, or to `maxValue` when that is set, as an
 * axis of numbers ends at `maxValue`. An end during a day is moved to the
 * end of that day. Unlike an axis of numbers, it does not reach down to
 * zero, which would be 1970, and values that are not dates are left out.
 * Its increment is a day, though `getDateTicks` decides what the axis
 * marks.
 * @param values - the dates on the axis
 * @param maxValue - the requested upper bound, if any
 */
export function getDateRange(values: number[], maxValue?: number): AxisRange {
    const dates = values.filter((value) => isDate(value));
    const start = new Date(dates.length > 0 ? Math.min(...dates) : Date.now());
    start.setHours(0, 0, 0, 0);

    const end = new Date(
        isDate(maxValue) ? maxValue : Math.max(start.getTime(), ...dates)
    );
    if (end.getTime() <= start.getTime()) {
        end.setTime(addDays(start, 1).getTime());
    } else if (end.getTime() > startOfDay(end)) {
        end.setTime(addDays(new Date(startOfDay(end)), 1).getTime());
    }

    return {
        minValue: start.getTime(),
        maxValue: end.getTime(),
        totalRange: end.getTime() - start.getTime(),
        increment: DAY,
    };
}

/**
 * What an axis of dates steps through, which decides how its dates are
 * written: weeks are written as days, and quarters as months.
 */
export type DateUnit = 'day' | 'month' | 'year';

/**
 * The dates an axis of dates marks, and what it steps through.
 */
export interface DateTicks {
    values: number[];
    unit: DateUnit;
}

/**
 * A step between the dates marked on an axis of dates.
 */
interface DateStep {
    unit: DateUnit;
    /** About how many days the step is. */
    days: number;
    /** The first date on or after `date` that the step marks. */
    first: (date: Date) => Date;
    /** The date one step after `date`. */
    next: (date: Date) => Date;
}

const DAYS_IN_MONTH = 30.44;
const DAYS_IN_YEAR = 365.25;
const DATE_STEP_COUNT = 6;

const dayStep = (count: number): DateStep => ({
    unit: 'day',
    days: count,
    first: (date) => date,
    next: (date) => addDays(date, count),
});

const weekStep = (count: number): DateStep => ({
    unit: 'day',
    days: 7 * count,
    first: (date) => addDays(date, (8 - date.getDay()) % 7),
    next: (date) => addDays(date, 7 * count),
});

const monthStep = (count: number): DateStep => ({
    unit: 'month',
    days: DAYS_IN_MONTH * count,
    first: (date) => {
        let month = date.getDate() === 1 ? date : getFirstOfMonth(date, 1);
        while (month.getMonth() % count !== 0) {
            month = getFirstOfMonth(month, 1);
        }

        return month;
    },
    next: (date) => getFirstOfMonth(date, count),
});

const yearStep = (count: number): DateStep => ({
    unit: 'year',
    days: DAYS_IN_YEAR * count,
    first: (date) => {
        let year = date.getFullYear();
        if (date.getTime() > createDate(year, 0, 1).getTime()) {
            year += 1;
        }

        return createDate(Math.ceil(year / count) * count, 0, 1);
    },
    next: (date) => createDate(date.getFullYear() + count, 0, 1),
});

const DATE_STEPS = [
    dayStep(1),
    dayStep(2),
    weekStep(1),
    weekStep(2),
    monthStep(1),
    monthStep(3),
    monthStep(6),
    yearStep(1),
    yearStep(2),
    yearStep(5),
    yearStep(10),
];

/**
 * The dates to mark on an axis of dates: days, Mondays, or the first days
 * of months, quarters, half years or years, whichever divides the axis
 * into at most about six steps. Dates take more room than numbers, so
 * they get fewer steps.
 * @param range - the range of the axis, from `getDateRange`
 * @returns the dates to mark, and whether they are days, months or years
 */
export function getDateTicks(
    range: Pick<AxisRange, 'minValue' | 'maxValue'>
): DateTicks {
    const days = (range.maxValue - range.minValue) / DAY;
    const decades = days / DAYS_IN_YEAR / 10;
    const step =
        DATE_STEPS.find(
            (candidate) => days / candidate.days <= DATE_STEP_COUNT
        ) ?? yearStep(10 * Math.ceil(decades / DATE_STEP_COUNT));
    const ticks: number[] = [];
    for (
        let date = step.first(new Date(range.minValue));
        date.getTime() <= range.maxValue;
        date = step.next(date)
    ) {
        ticks.push(date.getTime());
    }

    return { values: ticks, unit: step.unit };
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

function isUsableStep(step: number | undefined, span: number): boolean {
    return step > 0 && span / step <= MAX_AXIS_STEPS;
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

function addDays(date: Date, days: number): Date {
    return createDate(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + days
    );
}

function getFirstOfMonth(date: Date, monthsLater: number): Date {
    return createDate(date.getFullYear(), date.getMonth() + monthsLater, 1);
}

/**
 * The start of a day in local time. Unlike `new Date(year, month, day)`, it
 * keeps the years 0 to 99 rather than reading them as 1900 to 1999, see
 * https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makefullyear
 * @param year - the full year
 * @param month - the month, from 0 for January
 * @param day - the day of the month
 */
function createDate(year: number, month: number, day: number): Date {
    const date = new Date(0);
    date.setFullYear(year, month, day);
    date.setHours(0, 0, 0, 0);

    return date;
}

function startOfDay(date: Date): number {
    return new Date(date).setHours(0, 0, 0, 0);
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
