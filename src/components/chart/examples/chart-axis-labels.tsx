import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-with-negative-values';

/**
 * Displaying labels
 *
 * The `displayAxisLabels` prop controls the visibility of axis labels
 * for chart types that have X and Y axes (area, bar, line, and dot charts).
 * When set to `true`, the accessible labels `accessibleValuesLabel` and
 * `accessibleItemsLabel` (or their default translated fallbacks) are displayed to help
 * users understand the scale and values of the data.
 *
 * The `displayItemText` and `displayItemValue` props control the visibility of
 * item texts and values respectively for chart types that have X and Y axes
 * (area, bar, line, and dot charts).
 * When set to `true`, the texts and values of all chart items are constantly visible.
 *
 * :::note
 * If `formattedValue` is provided for an item, it is the one that will be displayed
 * when `displayItemValue` is set to `true`.
 * :::
 *
 * @sourceFile chart-items-with-negative-values.ts
 */
@Component({
    tag: 'limel-example-chart-axis-labels',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartAxisLabelsExample {
    @State()
    private displayAxisLabels = true;

    @State()
    private displayItemText = false;

    @State()
    private displayItemValue = false;

    @State()
    private chartType: 'bar' | 'area' | 'line' | 'dot' = 'bar';

    @State()
    private orientation: 'landscape' | 'portrait' = 'landscape';

    private chartTypes: Option[] = [
        { text: 'bar', value: 'bar' },
        { text: 'area', value: 'area' },
        { text: 'line', value: 'line' },
        { text: 'dot', value: 'dot' },
    ];

    private orientations: Option[] = [
        { text: 'landscape', value: 'landscape' },
        { text: 'portrait', value: 'portrait' },
    ];

    public render() {
        return (
            <Host class="large">
                <limel-chart
                    type={this.chartType}
                    items={chartItems}
                    displayAxisLabels={this.displayAxisLabels}
                    displayItemText={this.displayItemText}
                    displayItemValue={this.displayItemValue}
                    accessibleValuesLabel="Temperature in Celsius"
                    accessibleItemsLabel="City"
                    orientation={this.orientation}
                />
                <limel-example-controls>
                    <limel-select
                        label="orientation"
                        value={this.getSelectedOrientation()}
                        options={this.orientations}
                        onChange={this.handleOrientationChange}
                    />
                    <limel-select
                        label="type"
                        value={this.getSelectedChartType()}
                        options={this.chartTypes}
                        onChange={this.handleChartTypeChange}
                    />
                    <limel-switch
                        label="displayAxisLabels"
                        value={this.displayAxisLabels}
                        onChange={this.handleDisplayAxisLabelsChange}
                    />
                    <limel-switch
                        label="displayItemText"
                        value={this.displayItemText}
                        onChange={this.handleDisplayItemTextChange}
                    />
                    <limel-switch
                        label="displayItemValue"
                        value={this.displayItemValue}
                        onChange={this.handleDisplayItemValueChange}
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

    private getSelectedChartType() {
        return this.chartTypes.find(
            (option) => option.value === this.chartType
        );
    }

    private handleChartTypeChange = (
        event: LimelSelectCustomEvent<Option<string>>
    ) => {
        this.chartType = event.detail.value as 'bar' | 'area' | 'line' | 'dot';
    };

    private handleDisplayAxisLabelsChange = (event: CustomEvent<boolean>) => {
        this.displayAxisLabels = event.detail;
    };

    private handleDisplayItemTextChange = (event: CustomEvent<boolean>) => {
        this.displayItemText = event.detail;
    };

    private handleDisplayItemValueChange = (event: CustomEvent<boolean>) => {
        this.displayItemValue = event.detail;
    };
}
