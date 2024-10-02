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
