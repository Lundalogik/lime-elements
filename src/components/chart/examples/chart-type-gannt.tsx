import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-gantt';

/**
 * Gantt chart
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
    private range = 150;

    @State()
    private orientation: 'horizontal' | 'vertical' = 'horizontal';

    private orientations: Option[] = [
        { text: 'Horizontal', value: 'horizontal' },
        { text: 'Vertical', value: 'vertical' },
    ];

    public render() {
        const defaultRange = `${this.range}`;

        return (
            <Host class="large">
                <h4>Project Timeline: Key Phases from Concept to Launch</h4>
                <limel-chart
                    type="bar"
                    items={chartItems}
                    orientation={this.orientation}
                    range={this.range}
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
                        label="range"
                        value={defaultRange}
                        onChange={this.handleRangeChange}
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
        this.orientation = event.detail.value as 'horizontal' | 'vertical';
    };

    private handleRangeChange = (event) => {
        this.range = +event.detail;
    };
}
