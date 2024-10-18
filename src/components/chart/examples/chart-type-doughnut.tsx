import { Component, h, Host, State } from '@stencil/core';
import { chartItems } from './chart-items-pie';

/**
 * Doughnut chart
 *
 * @sourceFile chart-items-pie.ts
 */
@Component({
    tag: 'limel-example-chart-type-doughnut',
    shadow: true,
    styleUrl: 'chart-resizable-container.scss',
})
export class ChartTypeDoughnutExample {
    @State()
    private maxValue = 100;

    public render() {
        const defaultMaxValue = `${this.maxValue}`;

        return (
            <Host class="row-layout">
                <limel-chart
                    items={chartItems}
                    type="doughnut"
                    maxValue={this.maxValue}
                />
                <limel-example-controls>
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
    private handleMaxValueChange = (event) => {
        this.maxValue = +event.detail;
    };
}
