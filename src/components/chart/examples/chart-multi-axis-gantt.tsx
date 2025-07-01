import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-multi-axis-negative-start-values';

/**
 * Multi-axis with Negative Start Values
 * You can also get a multi-axis chart with items in your dataset
 * that have both start and end values, e.g. `value: [10, 20]`.
 *
 * @sourceFile chart-items-multi-axis-negative-start-values.ts
 */
@Component({
    tag: 'limel-example-chart-multi-axis-with-negative-start-values',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartMultiAxisWithNegativeStartValuesExample {
    @State()
    private orientation: 'landscape' | 'portrait' = 'landscape';

    @State()
    private type: 'bar' | 'dot' = 'bar';

    private orientations: Option[] = [
        { text: 'landscape', value: 'landscape' },
        { text: 'portrait', value: 'portrait' },
    ];

    private types: Option[] = [
        { text: 'Bar', value: 'bar' },
        { text: 'Dot', value: 'dot' },
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
        this.type = event.detail.value as 'bar' | 'dot';
    };
}
