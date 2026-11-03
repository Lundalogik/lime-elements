import { ChartItem } from './chart.types';
import { DrawnChartType } from './scale';

/**
 * The item's value as text: its `formattedValue` when set, otherwise its
 * value, range, or scatter point.
 * @param item - the item
 * @param type - the chart type
 */
export function formatValue(item: ChartItem, type: DrawnChartType): string {
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
