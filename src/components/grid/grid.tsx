import { Component, h } from '@stencil/core';

/**
 * @slot - Grid content
 */
@Component({
    tag: 'limel-grid',
    shadow: true,
    styleUrl: 'grid.scss',
})
export class Grid {
    public render() {
        return <slot />;
    }
}
