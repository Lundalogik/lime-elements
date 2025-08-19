import { Component, h } from '@stencil/core';

/**
 * This component is deprecated and will be removed in a future version of
 * Lime Elements. Please use CSS for your flexible container needs 🙂
 *
 * @deprecated Please use CSS instead https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
 * @private
 * @slot - Grid content
 */
@Component({
    tag: 'limel-grid',
    shadow: true,
    styleUrl: 'grid.scss',
})
export class Grid {
    public componentWillLoad() {
        console.warn(
            'limel-grid is deprecated, please use CSS instead: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout'
        );
    }

    public render() {
        return <slot />;
    }
}
