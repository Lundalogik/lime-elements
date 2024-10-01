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
     */
    value: T;

    /**
     * Formatted value of the item
     */
    formattedValue?: string;

    /**
     * Color of the item in the chart. Defaults to a shade of grey.
     * It is recommended to use distinct colors for each item,
     * and make sure there is enough contrast between colors of adjacent items.
     */
    color?: string;
}
