import { Component, h } from '@stencil/core';
/**
 * Size presets
 * You can chose a preset size for the component to render it desireably,
 * using the `size` prop.
 * However, if these preset sizes do not suit your UI needs, do not specify them
 * and instead specify the size using the `--circular-progress-size` variable,
 * which must always be according to our
 * [size rhythm](#/DesignGuidelines/size-rhythms.md/) guidelines.
 *
 * Note that the text size is automatically adjusted, based on the visual size
 * of the component.
 */

@Component({
    shadow: true,
    tag: 'limel-example-circular-progress-sizes',
    styleUrl: 'circular-progress.scss',
})
export class CircularProgressSizesExample {
    private value = 92.6;

    public render() {
        return [
            <limel-circular-progress value={this.value} size="x-small" />,
            <limel-circular-progress value={this.value} size="small" />,
            <limel-circular-progress value={this.value} size="medium" />,
            <limel-circular-progress value={this.value} size="large" />,
            <limel-circular-progress value={this.value} size="x-large" />,
        ];
    }
}
