import { Component, h, Host, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { chartItems } from './chart-items-with-negative-values';

/**
 * Using the `axisIncrement` prop
 * The `axisIncrement` prop specifies the incremental
 * values of the axis lines. By default the component tries to
 * smartly calculate a proper axis increment, to render meaningful
 * axis lines, based on the maximum value provided in the dataset.
 *
 * However, you can set the `axisIncrement` to a
 * different custom value if needed.
 *
 * @sourceFile chart-items-with-negative-values.ts
 */
@Component({
    tag: 'limel-example-chart-axis-increment',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartAxisIncrementExample {
    @State()
    private axisIncrement = 5;

    @State()
    private orientation: 'landscape' | 'portrait' = 'landscape';

    private orientations: Option[] = [
        { text: 'landscape', value: 'landscape' },
        { text: 'portrait', value: 'portrait' },
    ];

    public render() {
        const defaultAxisIncrement = `${this.axisIncrement}`;

        return (
            <Host class="large">
                <h4>Subscriptions per month</h4>
                <limel-chart
                    type="bar"
                    items={chartItems}
                    orientation={this.orientation}
                    axisIncrement={this.axisIncrement}
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
                        min={1}
                        max={20}
                        helperText="Try a value between 1 and 20"
                        label="axisIncrement"
                        value={defaultAxisIncrement}
                        onChange={this.handleAxisIncrementChange}
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

    private handleAxisIncrementChange = (event) => {
        this.axisIncrement = +event.detail;
    };
}
