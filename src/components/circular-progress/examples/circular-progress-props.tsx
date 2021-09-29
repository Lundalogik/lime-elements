import { Component, h } from '@stencil/core';
/**
 * Using the props
 * This component is initially designed to visualize a percentage on a scale of
 * zero to 100. However, you can easily visualize a progress in other scales,
 * simply by setting `maxValue` and `suffix`.
 *
 * Look at this example to see how the component displays an angle in a
 * 360-degrees scale, a 60-seconds scale, and a 5-stars rating.
 */
@Component({
    shadow: true,
    tag: 'limel-example-circular-progress-props',
    styleUrl: 'circular-progress.scss',
})
export class CircularProgressPropsExample {
    private degree = 45;
    private maxDegrees = 360;
    private degrees = '°';

    private second = 15;
    private maxSeconds = 60;
    private seconds = '"';

    private star = 4;
    private maxStars = 5;
    private stars = '⭐️';

    public render() {
        return [
            <limel-circular-progress
                value={this.degree}
                maxValue={this.maxDegrees}
                suffix={this.degrees}
            />,
            <limel-circular-progress
                value={this.second}
                maxValue={this.maxSeconds}
                suffix={this.seconds}
            />,
            <limel-circular-progress
                value={this.star}
                maxValue={this.maxStars}
                suffix={this.stars}
            />,
        ];
    }
}
