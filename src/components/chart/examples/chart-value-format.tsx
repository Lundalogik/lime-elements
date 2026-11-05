import { Component, h, Host } from '@stencil/core';
import { ChartItem } from '@limetech/lime-elements';

const revenue: ChartItem[] = [
    { text: 'Q1', value: 1_250_000 },
    { text: 'Q2', value: 1_840_000 },
    { text: 'Q3', value: 1_520_000 },
    { text: 'Q4', value: 2_310_000 },
];

const winRate: ChartItem[] = [
    { text: 'Jan', value: 0.32 },
    { text: 'Feb', value: 0.28 },
    { text: 'Mar', value: 0.41 },
    { text: 'Apr', value: 0.37 },
    { text: 'May', value: 0.45 },
    { text: 'Jun', value: 0.52 },
];

/**
 * Value format
 * Use `valueFormat` to write the values of a chart as percentages, or as
 * amounts of a `currency`. The axes, the values shown with
 * `displayItemValue`, the tooltips, and the screen reader table all follow
 * it, in the chart's `language`.
 *
 * Percentages are fractions of one, so `0.25` is written as `25 %`.
 * On the axis, amounts leave out their currency, and every value is
 * shortened once the axis reaches 10 000, such as `1,2 mn`.
 *
 * :::note
 * An item's `formattedValue` is shown as it is, whatever the `valueFormat`.
 * :::
 */
@Component({
    tag: 'limel-example-chart-value-format',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartValueFormatExample {
    public render() {
        return (
            <Host class="large">
                <limel-chart
                    type="bar"
                    items={revenue}
                    valueFormat="currency"
                    currency="SEK"
                    language="sv"
                    displayItemValue={true}
                    accessibleLabel="Revenue per quarter"
                />
                <limel-chart
                    type="line"
                    items={winRate}
                    valueFormat="percent"
                    displayItemValue={true}
                    accessibleLabel="Win rate per month"
                />
            </Host>
        );
    }
}
