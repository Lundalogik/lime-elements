import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-bar';

/**
 * Scatter chart
 *
 * @sourceFile chart-items-bar.ts
 */
@Component({
    tag: 'limel-example-chart-type-scatter',
    shadow: true,
    styleUrl: 'chart-resizable-container.scss',
})
export class ChartTypeScatterExample {
    @State()
    private maxValue = 100;

    @State()
    private orientation: 'horizontal' | 'vertical' = 'horizontal';

    private options: Option[] = [
        { text: 'Horizontal', value: 'horizontal' },
        { text: 'Vertical', value: 'vertical' },
    ];

    public render() {
        const defaultMaxValue = `${this.maxValue}`;

        return (
            <Host class="large">
                <h4>Subscriptions per month</h4>
                <limel-chart
                    type="scatter"
                    items={chartItems}
                    orientation={this.orientation}
                    maxValue={this.maxValue}
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
                        label="MaxValue"
                        value={defaultMaxValue}
                        onChange={this.handleMaxValueChange}
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
    private handleMaxValueChange = (event) => {
        this.maxValue = +event.detail;
    };
}
