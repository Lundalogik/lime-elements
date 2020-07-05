import { Component, h } from '@stencil/core';

/**
 * The `limel-grid` component creates a grid which can be used to control the
 * layout of other components. It uses CSS [grid-template-areas](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas)
 * to enable easy configuration of its child-elements.
 *
 * @exampleComponent limel-example-grid
 *
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
