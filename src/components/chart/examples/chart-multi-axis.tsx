import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-negative-values';

/**
 * Multi-axis Charts
 *
 * @sourceFile chart-items-negative-values.ts
 */
@Component({
    tag: 'limel-example-chart-multi-axis',
    shadow: true,
    styleUrl: 'chart-resizable-container.scss',
})
export class ChartTypeBarMultiAxisExample {
    @State()
    private range = 100;

    @State()
    private orientation: 'horizontal' | 'vertical' = 'horizontal';

    @State()
    private type: 'bar' | 'scatter' = 'bar';

    private orientations: Option[] = [
        { text: 'Horizontal', value: 'horizontal' },
        { text: 'Vertical', value: 'vertical' },
    ];

    private types: Option[] = [
        { text: 'Bar', value: 'bar' },
        { text: 'Scatter', value: 'scatter' },
    ];

    public render() {
        const defaultRange = `${this.range}`;

        return (
            <Host class="large">
                <h4>Temperature fluctuations past 24 hours</h4>
                <limel-chart
                    type={this.type}
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
                    <limel-select
                        label="type"
                        value={this.getSelectedType()}
                        options={this.types}
                        onChange={this.handleTypeChange}
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

    private getSelectedType() {
        return this.types.find((option) => option.value === this.type);
    }

    private handleTypeChange = (
        event: LimelSelectCustomEvent<Option<string>>,
    ) => {
        this.type = event.detail.value as 'bar' | 'scatter';
    };

    private handleRangeChange = (event) => {
        this.range = +event.detail;
    };
}
