import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-gantt-negative-values';

/**
 * Multi-axis Gantt Charts
 * To get a multi-axis gantt chart, just make sure items of your dataset
 * have both `startValue` and `value`, and that the `startValue` is
 * less than the `value`.
 *
 * Not recommended to use the `maxValue` prop.
 *
 * @sourceFile chart-items-gantt-negative-values.ts
 */
@Component({
    tag: 'limel-example-chart-multi-axis-gantt',
    shadow: true,
    styleUrl: 'chart-resizable-container.scss',
})
export class ChartMultiAxisGanttExample {
    @State()
    private orientation: 'landscape' | 'portrait' = 'landscape';

    @State()
    private type: 'bar' | 'scatter' = 'bar';

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
        this.type = event.detail.value as 'bar' | 'scatter';
    };
}
