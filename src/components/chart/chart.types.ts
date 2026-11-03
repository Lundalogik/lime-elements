import { Color } from '../../global/shared-types/color.types';

/**
 * The kinds of chart that `limel-chart` can draw.
 *
 * `stacked-bar` is the old name of `proportion-bar`. It still works, but
 * logs a warning.
 * @beta
 */
export type ChartType =
    | 'area'
    | 'bar'
    | 'doughnut'
    | 'line'
    | 'nps'
    | 'pie'
    | 'ring'
    | 'dot'
    | 'scatter'
    | 'proportion-bar'
    | 'stacked-bar';

/**
 * How `limel-chart` writes values.
 * - `number`: as numbers, such as `1 234,5` in Swedish
 * - `percent`: as percentages, where `0.25` is `25 %`
 * - `currency`: as amounts of the chart's `currency`, such as `1 234 kr`
 * - `date`: as dates, where each value is a date in milliseconds since
 *   1970, as `Date.getTime()` gives it
 * @beta
 */
export type ChartValueFormat = 'number' | 'percent' | 'currency' | 'date';

/**
 * Chart component props.
 * @beta
 */
export interface ChartItem<
    T extends number | [number, number] = number | [number, number],
> {
    /**
     * Label displayed for the item.
     */
    text: string;

    /**
     * Value of the item.
     *
     * A `[number, number]` tuple is interpreted according to the chart `type`:
     * for most types it is a value range `[start, end]` (such as a Gantt-style
     * bar), while for the `scatter` type it is an `[x, y]` coordinate pair.
     *
     * When the chart's `valueFormat` is `date`, each number is a date in
     * milliseconds since 1970, as `Date.getTime()` gives it.
     */
    value: T;

    /**
     * Formatted value of the item. Shown instead of the value, written as
     * the chart's `valueFormat` would write it.
     */
    formattedValue?: string;

    /**
     * Color of the item in the chart. Defaults to a shade of grey.
     * It is recommended to use distinct colors for each item,
     * and make sure there is enough contrast between colors of adjacent items.
     */
    color?: Color;

    /**
     * When set to `true`, the item will become clickable,
     * which provides visual and accessible feedback when hovered, or focused,
     * and also results in emitting an event when clicked.
     */
    clickable?: boolean;
}
