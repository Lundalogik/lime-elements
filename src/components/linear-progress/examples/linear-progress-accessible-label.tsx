import { Component, h } from '@stencil/core';

/**
 * Using an accessible label
 * The component tells the assistive technologies that it is a "Progress bar".
 * However, instead of relying on such a generic label,
 * you can provide a more specific label that describes what the progress bar is for,
 * or what kind of progress it is visualizing.
 *
 * This is achieved, using the `accessibleLabel` property.
 */
@Component({
    shadow: true,
    tag: 'limel-example-linear-progress-accessible-label',
})
export class LinearProgressAccessibleLabelExample {
    public render() {
        return (
            <limel-linear-progress
                value={0.87}
                accessibleLabel="Percentage of today's progress"
            />
        );
    }
}
