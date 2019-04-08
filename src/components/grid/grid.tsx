import { Component, h } from '@stencil/core';

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
