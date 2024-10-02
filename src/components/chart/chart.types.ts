/**
 * Chart component props.
 * @public
 */
export interface ChartItem {
    /**
     * label displayed for the item.
     */
    text: string;

    /**
     * value of the item.
     */
    value: number;

    /**
     * Defines the starting value of those items
     * which are not a single data point, and instead
     * represent a range.
     */
    startValue?: number;

    /**
     * A prefix shown before the value
     */
    prefix?: string;

    /**
     * A suffix shown after the value.
     */
    suffix?: string;

    /**
     * color of the item in the chart.
     */
    color: string;
}
