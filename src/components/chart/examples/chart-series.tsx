import { Component, h, Host, State } from '@stencil/core';
import {
    ChartSeries,
    ChartType,
    LimelSelectCustomEvent,
    Option,
} from '@limetech/lime-elements';

const series: ChartSeries[] = [
    {
        text: 'Won',
        items: [
            { text: 'Jan', value: 12 },
            { text: 'Feb', value: 15 },
            { text: 'Mar', value: 9 },
            { text: 'Apr', value: 18 },
            { text: 'May', value: 21 },
            { text: 'Jun', value: 17 },
        ],
    },
    {
        text: 'Lost',
        items: [
            { text: 'Jan', value: 7 },
            { text: 'Feb', value: 9 },
            { text: 'Mar', value: 11 },
            { text: 'Apr', value: 6 },
            { text: 'May', value: 8 },
            { text: 'Jun', value: 5 },
        ],
    },
    {
        text: 'Open',
        items: [
            { text: 'Feb', value: 4 },
            { text: 'Mar', value: 10 },
            { text: 'Apr', value: 13 },
            { text: 'May', value: 9 },
            { text: 'Jun', value: 14 },
        ],
    },
];

const types: Option[] = [
    { text: 'bar', value: 'bar' },
    { text: 'dot', value: 'dot' },
    { text: 'line', value: 'line' },
    { text: 'area', value: 'area' },
];

/**
 * Series
 * Use `series` instead of `items` to draw several groups of items next to
 * each other, such as the deals that were won, lost, or are still open each
 * month. Each series has a color of its own, and a legend names the series
 * when there are two or more. `bar`, `dot`, `line`, and `area` charts can
 * draw series.
 *
 * Items of different series that have the same `text` are drawn together.
 * A series can leave out an item that the others have, as "Open" leaves out
 * January here. Its place is then left empty.
 *
 * :::note
 * The tooltip of each place on the axis shows the values of every series
 * there. Assistive technology reads the series as a table, with a column for
 * each series, and the arrow keys move between its cells.
 * :::
 */
@Component({
    tag: 'limel-example-chart-series',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartSeriesExample {
    @State()
    private type = types[0];

    public render() {
        return (
            <Host class="large">
                <limel-chart
                    type={this.type.value as ChartType}
                    series={series}
                    accessibleLabel="Deals per month"
                    accessibleItemsLabel="Month"
                />
                <limel-example-controls>
                    <limel-select
                        label="type"
                        options={types}
                        value={this.type}
                        onChange={this.handleTypeChange}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private readonly handleTypeChange = (
        event: LimelSelectCustomEvent<Option>
    ) => {
        this.type = event.detail;
    };
}
