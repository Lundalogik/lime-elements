import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-gantt';

/**
 * Gantt chart
 * Gantt charts are used to visualize items that have a defined start and end value, making them ideal
 * for displaying timelines or project phases. Each item typically represents a phase or task, with its length
 * indicating duration.
 *
 * It's good for:
 * - Visualizing project schedules, with tasks and milestones over time.
 * - Showing task dependencies, start and end dates, and overlaps between phases.
 * - Providing an easy-to-understand timeline for project planning and tracking.
 *
 * :::tip
 * **Use:**
 * - When you need to show the progression of tasks or stages over time.
 * - When items have start points which are not simply zero.
 *
 * **Avoid:**
 * - For datasets that don't involve time or sequential phases (bar charts or line charts may be better).
 *
 * **Note:**
 * In Gantt charts, items have a start value to indicate when they begin. Unlike other charts,
 * where items default to a start value of `0`, each Gantt chart item should specify a start value
 * and an end value (e.g., `value: [10, 20]`), which determines the duration and position of the item.
 * :::
 *
 * @sourceFile chart-items-gantt.ts
 */
@Component({
    tag: 'limel-example-chart-type-gantt',
    shadow: true,
    styleUrl: 'chart-examples.scss',
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
