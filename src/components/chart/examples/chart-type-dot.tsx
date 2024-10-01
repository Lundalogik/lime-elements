import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-bar';

/**
 * Dot chart
 * A dot chart displays values for each category using dots along an axis, similar to a bar chart but with dots
 * at the value associated with each category instead of bars. It’s often used as an alternative to bar charts,
 * especially when focusing on individual data points or reducing visual clutter.
 *
 * It's good for:
 * - Comparing values across categories in a clean and uncluttered way.
 * - Visualizing discrete data points without the visual weight of bars.
 * - Allowing readers to focus on precise values and distribution.
 *
 * :::tip
 * **Use:**
 * - When comparing values across categories in a straightforward way.
 * - For datasets where you do not want to emphasize on or compare "volumes" or "sizes",
 * but rather compare the points that the data represents.
 *
 * **Avoid:**
 * - For datasets with very few or very densely packed points, which could make the chart difficult to read.
 * - When representing complex relationships or multiple variables (scatter plots or line charts may be more effective).
 * :::
 * @sourceFile chart-items-bar.ts
 */
@Component({
    tag: 'limel-example-chart-type-dot',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartTypeDotExample {
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
                    type="dot"
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
