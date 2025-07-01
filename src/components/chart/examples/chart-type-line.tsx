import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-area';

/**
 * Line chart
 * A line chart connects data points with a continuous line,
 * often used for displaying trends over intervals.
 *
 * It's good for:
 * - Showing trends over time in a simple, readable format.
 * - Highlighting increases, decreases, or patterns in a dataset.
 *
 * :::tip
 * **Use:**
 * - For tracking data changes over time, especially with multiple data points.
 * - When visualizing time-series data to show overall trends.
 *
 * **Avoid:**
 * - For large fluctuations, which may make data misinterpretations likely.
 * - When individual point comparison is critical (consider a bar or dot chart).
 * :::
 *
 * @sourceFile chart-items-area.ts
 */
@Component({
    tag: 'limel-example-chart-type-line',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartTypeLineExample {
    @State()
    private maxValue = 100;

    @State()
    private orientation: 'landscape' | 'portrait' = 'landscape';

    private orientations: Option[] = [
        { text: 'landscape', value: 'landscape' },
        { text: 'portrait', value: 'portrait' },
    ];

    public render() {
        const defaultMaxValue = `${this.maxValue}`;

        return (
            <Host class="large">
                <h4>Subscriptions per month</h4>
                <limel-chart
                    type="line"
                    items={chartItems}
                    orientation={this.orientation}
                    maxValue={this.maxValue}
                />
                <limel-example-controls>
                    <limel-select
                        label="orientation"
                        value={this.getSelectedOrientation()}
                        options={this.orientations}
                        onChange={this.handleOrientationChange}
                    />
                    <limel-input-field
                        type="number"
                        label="maxValue"
                        value={defaultMaxValue}
                        onChange={this.handleMaxValueChange}
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

    private handleMaxValueChange = (event) => {
        this.maxValue = +event.detail;
    };
}
