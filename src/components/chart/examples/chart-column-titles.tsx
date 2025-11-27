import { Component, h, Host, State } from '@stencil/core';
import { chartItems } from './chart-items-bar';

/**
 * Bar chart with column titles
 *
 * By setting the `showColumnTitles` prop to `true`, you can display column titles
 * for bar charts in landscape orientation. This is useful when you want to clearly
 * label each bar with its category name directly in the chart, rather than relying
 * on tooltips.
 *
 * When `showColumnTitles` is `false` (the default), the chart will use tooltips
 * to display item information on hover instead.
 */
@Component({
    tag: 'limel-example-chart-column-titles',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartColumnTitlesExample {
    @State()
    private showColumnTitles = true;

    public render() {
        return (
            <Host class="large">
                <h4>Monthly Sales Performance</h4>
                <limel-chart
                    type="bar"
                    items={chartItems}
                    orientation="landscape"
                    showColumnTitles={this.showColumnTitles}
                    maxValue={100}
                />
                <limel-example-controls>
                    <limel-switch
                        label="Show column titles"
                        value={this.showColumnTitles}
                        onChange={this.handleToggleChange}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private handleToggleChange = (event: CustomEvent<boolean>) => {
        this.showColumnTitles = event.detail;
    };
}
