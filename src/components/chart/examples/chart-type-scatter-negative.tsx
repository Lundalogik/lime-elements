import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-scatter-negative';

/**
 * Scatter chart with negative values
 * Because a scatter chart has two value axes, either of them can carry negative
 * values — unlike single-axis charts, where only the value axis can. When the
 * data spans negative and positive on both axes, the chart draws a zero line on
 * each axis and places points in the correct quadrant relative to the origin.
 *
 * Switching the `orientation` still transposes the whole plot, zero lines and
 * negative ranges included.
 *
 * @sourceFile chart-items-scatter-negative.ts
 */
@Component({
    tag: 'limel-example-chart-type-scatter-negative',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartTypeScatterNegativeExample {
    @State()
    private orientation: 'landscape' | 'portrait' = 'landscape';

    private orientations: Option[] = [
        { text: 'landscape', value: 'landscape' },
        { text: 'portrait', value: 'portrait' },
    ];

    public render() {
        return (
            <Host class="large">
                <h4>Revenue vs. profit change, year over year</h4>
                <limel-chart
                    type="scatter"
                    items={chartItems}
                    orientation={this.orientation}
                    accessibleLabel="Year-over-year revenue and profit change per business unit"
                    accessibleItemsLabel="Revenue change (%)"
                    accessibleValuesLabel="Profit change (%)"
                />
                <limel-example-controls>
                    <limel-select
                        label="orientation"
                        value={this.getSelectedOrientation()}
                        options={this.orientations}
                        onChange={this.handleOrientationChange}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private getSelectedOrientation() {
        return this.orientations.find(
            (option) => option.value === this.orientation
        );
    }

    private handleOrientationChange = (
        event: LimelSelectCustomEvent<Option<string>>
    ) => {
        this.orientation = event.detail.value as 'landscape' | 'portrait';
    };
}
