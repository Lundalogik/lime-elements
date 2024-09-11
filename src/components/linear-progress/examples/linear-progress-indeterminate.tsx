import { Component, h } from '@stencil/core';

/**
 * Indeterminate progress
 * The component can be put in an indeterminate state,
 * where the progress bar will animate without a specific value.
 *
 * This is useful for instance when the progress is not known,
 * but the user should be aware that something is happening.
 */
@Component({
    shadow: true,
    tag: 'limel-example-linear-progress-indeterminate',
})
export class LinearProgressExampleIndeterminate {
    public render() {
        return <limel-linear-progress indeterminate={true} />;
    }
}
