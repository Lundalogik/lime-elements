import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-with-negative-values';

/**
 * Multi-axis Charts
 * Normally, charts visualize items in a positive range.
 * However, there are cases where you want to visualize items that have both
 * positive and negative `value`s.
 *
 * @sourceFile chart-items-with-negative-values.ts
 */
@Component({
    tag: 'limel-example-chart-multi-axis',
    shadow: true,
    styleUrl: 'chart-resizable-container.scss',
})
export class ChartTypeMultiAxisExample {
    @State()
    private orientation: 'landscape' | 'portrait' = 'landscape';

    @State()
    private type: 'bar' | 'scatter' = 'scatter';

    private orientations: Option[] = [
        { text: 'landscape', value: 'landscape' },
        { text: 'portrait', value: 'portrait' },
    ];

    private types: Option[] = [
        { text: 'Bar', value: 'bar' },
        { text: 'Scatter', value: 'scatter' },
    ];

    public render() {
        return (
            <Host class="large">
                <h4>Temperature right now</h4>
                <limel-chart
                    type={this.type}
                    items={chartItems}
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
                        value={this.getSelectedType()}
                        options={this.types}
                        onChange={this.handleTypeChange}
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

    private getSelectedType() {
        return this.types.find((option) => option.value === this.type);
    }

    private handleTypeChange = (
        event: LimelSelectCustomEvent<Option<string>>,
    ) => {
        this.type = event.detail.value as 'bar' | 'scatter';
    };
}
