import { Component, h, Prop } from '@stencil/core';
import { CircularProgressSize } from '../../interface';
import { abbreviate } from '../badge/format';

const PERCENT = 100;

/**
 * The circular progress component can be used to visualize the curent state of
 * a progress in a scale; for example percentage of completion of a task.
 *
 * Its compact UI makes the component suitable when there is not enough screen
 * space available to visualise such information.
 *
 * This component allows you to define your scale, from `0` to a desired
 * `maxValue`; and also lets you chose a proper `suffix` for your scale.
 *
 * :::note
 * The component will round up the value when it is displayed, and only shows
 * one decimal digit.
 * It also abbreviates large numbers. For example 1234 will be displayed as 1.2k.
 * Of course such numbers, if bigger than `maxValue` will be visualized as a
 * full progress.
 * :::
 * @exampleComponent limel-example-circular-progress
 * @exampleComponent limel-example-circular-progress-sizes
 * @exampleComponent limel-example-circular-progress-props
 * @exampleComponent limel-example-circular-progress-css-variables
 * @exampleComponent limel-example-circular-progress-percentage-colors
 */
@Component({
    tag: 'limel-circular-progress',
    shadow: true,
    styleUrl: 'circular-progress.scss',
})
export class CircularProgress {
    /**
     * The value of the progress bar.
     */
    @Prop()
    public value: number = 0;

    /**
     * The maximum value within the scale that the progress bar should visualize. Defaults to `100`.
     */
    @Prop()
    public maxValue: number = PERCENT;

    /**
     * The prefix which is displayed before the `value`, must be a few characters characters long.
     */
    @Prop({ reflect: true })
    public prefix?: string = null;

    /**
     * The suffix which is displayed after the `value`, must be one or two characters long. Defaults to `%`
     */
    @Prop()
    public suffix: string = '%';

    /**
     * When set to `true`, makes the filled section showing the percentage colorful. Colors change with intervals of 10%.
     */
    @Prop()
    public displayPercentageColors: boolean = false;

    /**
     * Determines the visual size of the visualization from a preset size. This property can override the `--circular-progress-size` variable if it is specified.
     */
    @Prop({ reflect: true })
    public size: CircularProgressSize;

    public render() {
        const classList = {
            'lime-circular-progress': true,
            'displays-percentage-colors': this.displayPercentageColors,
        };

        const currentPercentage = (this.value * PERCENT) / this.maxValue + '%';
        const value = Math.round(this.value * 10) / 10; // eslint-disable-line no-magic-numbers

        return (
            <div
                role="progressbar"
                class={classList}
                aria-label="%"
                aria-valuemin="0"
                aria-valuemax={this.maxValue}
                aria-valuenow={this.value}
                style={{ '--percentage': currentPercentage }}
            >
                {this.renderPrefix()}
                <span class="value">
                    {abbreviate(value)}
                    <span class="suffix">{this.suffix}</span>
                </span>
            </div>
        );
    }
    private renderPrefix = () => {
        if (this.prefix) {
            return <span class="prefix">{this.prefix}</span>;
        }
    };
}
