import { Component, h, Host, State } from '@stencil/core';
import {
    ChartSeries,
    ChartType,
    LimelSelectCustomEvent,
    Option,
} from '@limetech/lime-elements';

const quarters = (values: number[]) =>
    values.map((value, index) => ({ text: `Q${index + 1}`, value: value }));

const series: ChartSeries[] = [
    {
        text: 'Licences',
        items: quarters([420_000, 480_000, 510_000, 590_000]),
    },
    {
        text: 'Services',
        items: quarters([180_000, 210_000, 160_000, 240_000]),
    },
    {
        text: 'Support',
        items: quarters([90_000, 95_000, 100_000, 110_000]),
    },
    {
        text: 'Refunds',
        items: quarters([-30_000, -12_000, -45_000, -20_000]),
    },
];

const types: Option[] = [
    { text: 'bar', value: 'bar' },
    { text: 'line', value: 'line' },
    { text: 'area', value: 'area' },
];

/**
 * Stacked series
 * Set `stacked` to stack the `series` on each other, so that each place on
 * the axis shows their total, such as the revenue of each product, which
 * adds up to the revenue of the quarter. `bar`, `line`, and `area` charts
 * can stack their series.
 *
 * Positive and negative values are stacked on their own side of zero, as
 * the refunds are here.
 */
@Component({
    tag: 'limel-example-chart-series-stacked',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartSeriesStackedExample {
    @State()
    private type = types[0];

    public render() {
        return (
            <Host class="large">
                <limel-chart
                    type={this.type.value as ChartType}
                    series={series}
                    stacked={true}
                    valueFormat="currency"
                    currency="SEK"
                    language="sv"
                    accessibleLabel="Revenue per quarter"
                    accessibleItemsLabel="Quarter"
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
