import { Component, h, Host } from '@stencil/core';
import { ChartItem } from '@limetech/lime-elements';

const day = (month: number, date: number) =>
    new Date(2026, month - 1, date).getTime();

const phases: Array<ChartItem<[number, number]>> = [
    {
        text: 'Market research',
        value: [day(1, 12), day(2, 6)],
        color: 'rgb(var(--color-blue-default))',
    },
    {
        text: 'Prototyping',
        value: [day(2, 2), day(3, 20)],
        color: 'rgb(var(--color-cyan-default))',
    },
    {
        text: 'Pilot with customers',
        value: [day(3, 16), day(5, 8)],
        color: 'rgb(var(--color-teal-default))',
    },
    {
        text: 'Launch',
        value: [day(5, 4), day(6, 12)],
        color: 'rgb(var(--color-green-default))',
    },
];

/**
 * Dates
 * With `valueFormat` set to `date`, each value is a date in milliseconds
 * since 1970, as `Date.getTime()` gives it. The value axis then marks days,
 * Mondays, or the first days of months, quarters or years, depending on how
 * long a time the chart spans, and the tooltips write each date in the
 * chart's `language`.
 *
 * Together with ranges, this makes a Gantt chart of real dates.
 * The axis starts at the earliest date, not at zero.
 *
 * :::note
 * `axisIncrement` has no effect on dates, since months and years are not
 * all equally long.
 * :::
 */
@Component({
    tag: 'limel-example-chart-value-format-date',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartValueFormatDateExample {
    public render() {
        return (
            <Host class="large">
                <limel-chart
                    type="bar"
                    orientation="portrait"
                    items={phases}
                    valueFormat="date"
                    language="sv"
                    accessibleLabel="Project phases"
                />
            </Host>
        );
    }
}
