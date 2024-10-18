import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-multi-axis-negative-start-values-area';

/**
 * Multi-axis Area Chart with Negative `startValue`s
 * You can also get a multi-axis Area chart, by making sure that
 * each item's `startValue` is smaller than its `value`.
 *
 * :::important
 * For Multi-axis Area charts to render correctly,
 * you cannot have items that only have negative `value`s.
 * You must make sure to have both `startValue` and
 * `value` for all items in your dataset.
 * :::
 *
 * @sourceFile chart-items-multi-axis-negative-start-values-area.ts
 */
@Component({
    tag: 'limel-example-chart-multi-axis-area-with-negative-start-values',
    shadow: true,
    styleUrl: 'chart-resizable-container.scss',
})
export class ChartMultiAxisAreaWithNegativeStartValuesExample {
    @State()
    private orientation: 'landscape' | 'portrait' = 'landscape';

    @State()
    private type: 'area' | 'scatter' = 'area';

    private orientations: Option[] = [
        { text: 'landscape', value: 'landscape' },
        { text: 'portrait', value: 'portrait' },
    ];

    private types: Option[] = [
        { text: 'Area', value: 'area' },
        { text: 'Scatter', value: 'scatter' },
    ];

    public render() {
        return (
            <Host class="tall">
                <h4>Temperature fluctuations past 24 hours</h4>
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
        this.type = event.detail.value as 'area' | 'scatter';
    };
}
