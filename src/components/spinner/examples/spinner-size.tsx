import { Component, h } from '@stencil/core';

/**
 * Spinner sizes
 */
@Component({
    tag: 'limel-example-spinner-size',
    shadow: true,
    styleUrl: 'spinner.scss',
})
export class SpinnerSizeExample {
    public render() {
        return [
            <div class="spinner-sizes">
                <limel-spinner />
                <limel-spinner size="mini" />
                <limel-spinner size="x-small" />
                <limel-spinner size="small" />
                <limel-spinner size="medium" />
                <limel-spinner size="large" />
            </div>,
        ];
    }
}
