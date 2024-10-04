import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-bar';

/**
 * Gantt chart
 *
 * @sourceFile chart-items-bar.ts
 */
@Component({
    tag: 'limel-example-chart-type-gantt',
    shadow: true,
    styleUrl: 'chart-resizable-container.scss',
})
export class ChartTypeGanttExample {
    @State()
    private range = 100;

    @State()
    private orientation: 'horizontal' | 'vertical' = 'horizontal';

    private options: Option[] = [
        { text: 'Horizontal', value: 'horizontal' },
        { text: 'Vertical', value: 'vertical' },
    ];

    public render() {
        const defaultrange = `${this.range}`;

        return (
            <Host class="large">
                <h4>Subscriptions per month</h4>
                <limel-chart
                    type="gantt"
                    items={chartItems}
                    orientation={this.orientation}
                    range={this.range}
                />
                <limel-example-controls>
                    <limel-select
                        label="orientation"
                        value={this.getSelectedOption()}
                        options={this.options}
                        onChange={this.handleOrientationChange}
                    />
                    <limel-input-field
                        type="number"
                        label="range"
                        value={defaultrange}
                        onChange={this.handlerangeChange}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private getSelectedOption() {
        return this.options.find((option) => option.value === this.orientation);
    }

    private handleOrientationChange = (
        event: LimelSelectCustomEvent<Option<string>>,
    ) => {
        this.orientation = event.detail.value as 'horizontal' | 'vertical';
    };

    private handlerangeChange = (event) => {
        this.range = +event.detail;
    };
}
