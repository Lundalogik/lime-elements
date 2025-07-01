import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-multi-axis-negative-start-values-area';

/**
 * Multi-axis Area Chart with Negative Start Values
 * You can also get a multi-axis Area chart, by making sure that
 * each item has a start value, and some of them are negative.
 *
 * @sourceFile chart-items-multi-axis-negative-start-values-area.ts
 */
@Component({
    tag: 'limel-example-chart-multi-axis-area-with-negative-start-values',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartMultiAxisAreaWithNegativeStartValuesExample {
    @State()
    private orientation: 'landscape' | 'portrait' = 'landscape';

    @State()
    private type: 'area' | 'dot' = 'area';

    private orientations: Option[] = [
        { text: 'landscape', value: 'landscape' },
        { text: 'portrait', value: 'portrait' },
    ];

    private types: Option[] = [
        { text: 'Area', value: 'area' },
        { text: 'Dot', value: 'dot' },
    ];

    public render() {
        return (
            <Host class="large">
                <h4>Electricity price fluctuations, past 20 days</h4>
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
            (option) => option.value === this.orientation
        );
    }

    private handleOrientationChange = (
        event: LimelSelectCustomEvent<Option<string>>
    ) => {
        this.orientation = event.detail.value as 'landscape' | 'portrait';
    };

    private getSelectedType() {
        return this.types.find((option) => option.value === this.type);
    }

    private handleTypeChange = (
        event: LimelSelectCustomEvent<Option<string>>
    ) => {
        this.type = event.detail.value as 'area' | 'dot';
    };
}
