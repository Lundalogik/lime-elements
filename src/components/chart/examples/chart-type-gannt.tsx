import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-gantt';

/**
 * Gantt chart
 * Gantt charts are used to visualize items that have a start and a finish value.
 * A common use case is to visualize project timelines, where each item represents
 * a phase in the project.
 *
 * In most charts, items have a default start value of `0`, which is why
 * you normally do not provide it in your dataset.
 * But to create a Gantt chart, you simply need to specify a `startValue`
 * for each item in your dataset, which does not equal to `0`.
 *
 * @sourceFile chart-items-gantt.ts
 */
@Component({
    tag: 'limel-example-chart-type-gantt',
    shadow: true,
    styleUrl: 'chart-resizable-container.scss',
})
export class ChartTypeGanttExample {
    @State()
    private maxValue = 170;

    @State()
    private orientation: 'landscape' | 'portrait' = 'portrait';

    private orientations: Option[] = [
        { text: 'landscape', value: 'landscape' },
        { text: 'portrait', value: 'portrait' },
    ];

    public render() {
        const defaultMaxValue = `${this.maxValue}`;

        return (
            <Host class="tall">
                <h4>Project Timeline: Key Phases from Concept to Launch</h4>
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
