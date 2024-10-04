import { Component, h, Host, State } from '@stencil/core';
import { chartItems } from './chart-items-stack';

/**
 * Pie chart
 *
 * @sourceFile chart-stacked-bar-items.ts
 */
@Component({
    tag: 'limel-example-chart-type-pie',
    shadow: true,
    styleUrl: 'chart-resizable-container.scss',
})
export class ChartTypePieExample {
    @State()
    private range = 300;

    public render() {
        const defaultRange = `${this.range}`;

        return (
            <Host class="row-layout">
                <limel-chart items={chartItems} type="pie" range={this.range} />
                <limel-example-controls>
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
    private handleRangeChange = (event) => {
        this.range = +event.detail;
    };
}
