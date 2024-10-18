import { Component, h, Host, State } from '@stencil/core';
import { chartItems } from './chart-items-ring';

/**
 * Ring chart
 *
 * @sourceFile chart-items-ring.ts
 */
@Component({
    tag: 'limel-example-chart-type-ring',
    shadow: true,
    styleUrl: 'chart-resizable-container.scss',
})
export class ChartTypeRingExample {
    @State()
    private maxValue = 10;

    public render() {
        const defaultMaxValue = `${this.maxValue}`;

        return (
            <Host class="row-layout">
                <limel-chart
                    items={chartItems}
                    type="ring"
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
