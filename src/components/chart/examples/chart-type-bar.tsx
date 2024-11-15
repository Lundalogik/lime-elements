import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-bar';

/**
 * Bar chart
 * A bar chart displays data with rectangular bars, where the length of each bar represents the value of a data point.
 *
 * It's good for:
 * - Comparing discrete categories or groups.
 * - Visualizing changes in data over time when categories are limited.
 *
 * :::tip
 * **Use:**
 * - When you have categorical data that needs clear comparisons.
 * - For datasets with fewer than 20 categories, as too many bars can make it hard to read.
 *
 * **Avoid:**
 * - When showing continuous data trends over time (a line chart might be better).
 * - When you have many categories, which could make the chart crowded.
 * :::
 *
 * @sourceFile chart-items-bar.ts
 */
@Component({
    tag: 'limel-example-chart-type-bar',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartTypeBarExample {
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
                    type="bar"
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
            (option) => option.value === this.orientation,
        );
    }

    private handleOrientationChange = (
        event: LimelSelectCustomEvent<Option<string>>,
    ) => {
        this.orientation = event.detail.value as 'landscape' | 'portrait';
    };

    private handleMaxValueChange = (event) => {
        this.maxValue = +event.detail;
    };
}
