import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-scatter';

/**
 * Scatter chart
 * A scatter chart plots each item as a dot at an `[x, y]` coordinate, using
 * both axes as value axes. Unlike a dot chart, items are not spaced out one per
 * row or column: they are positioned absolutely, so they can sit close
 * together, overlap, or stack directly on top of each other. This makes the
 * shape of the cloud of points — clusters, gaps, and correlation — visible.
 *
 * For a scatter chart, each item's `value` is given as an `[x, y]` coordinate
 * pair — unlike other chart types, where a `[number, number]` `value` means a
 * `[start, end]` range. Switching the `orientation` transposes the plot,
 * swapping which axis each value is plotted along. The `maxValue` and
 * `axisIncrement` properties have no effect on this type; both axis ranges and
 * their grid steps are derived automatically from the data.
 *
 * It's good for:
 * - Revealing the relationship (or correlation) between two variables.
 * - Spotting clusters, outliers, and the overall distribution of data points.
 *
 * :::tip
 * **Use:**
 * - When comparing two numeric variables against each other.
 * - For datasets where many points may share or nearly share a position, and
 *   that density is itself meaningful.
 *
 * **Avoid:**
 * - When one axis represents discrete categories rather than a numeric value
 *   (a dot or bar chart is clearer).
 * - For very small datasets, where the relationship is not yet meaningful.
 * :::
 *
 * @sourceFile chart-items-scatter.ts
 */
@Component({
    tag: 'limel-example-chart-type-scatter',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartTypeScatterExample {
    @State()
    private orientation: 'landscape' | 'portrait' = 'landscape';

    @State()
    private dotSize = 0.5;

    private orientations: Option[] = [
        { text: 'landscape', value: 'landscape' },
        { text: 'portrait', value: 'portrait' },
    ];

    public render() {
        return (
            <Host class="large">
                <h4>New customers per marketing spend</h4>
                <limel-chart
                    type="scatter"
                    items={chartItems}
                    orientation={this.orientation}
                    accessibleLabel="New customers per marketing spend"
                    accessibleItemsLabel="Marketing spend (in thousands)"
                    accessibleValuesLabel="New customers"
                    style={{
                        '--chart-scatter-item-size': `${this.dotSize}rem`,
                    }}
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
                        label="dot size (rem)"
                        step={0.25}
                        value={`${this.dotSize}`}
                        onChange={this.handleDotSizeChange}
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

    private handleDotSizeChange = (event: CustomEvent<string>) => {
        this.dotSize = +event.detail;
    };
}
