import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-area';

/**
 * Area chart
 * An area chart is like a line chart but with the area below the line filled in,
 * representing cumulative data.
 *
 * It's good for:
 * - Showing cumulative totals over time.
 * - Emphasizing data changes while highlighting volume or totals.
 *
 * :::tip
 * **Use:**
 * - For showing cumulative data trends where total volume over time is meaningful.
 * - When visualizing stacked data in a cumulative format.
 *
 * **Avoid:**
 * - If individual values need precise comparison (stacked bar charts are more suitable).
 * - For datasets with highly fluctuating values, as overlapping areas can obscure details.
 * :::
 * @sourceFile chart-items-area.ts
 */
@Component({
    tag: 'limel-example-chart-type-area',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartTypeAreaExample {
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
                    type="area"
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
