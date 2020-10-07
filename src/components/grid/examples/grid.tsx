import { Component, h } from '@stencil/core';

/**
 * We use the `grid-area` property to give each component a unique name, and
 * then use this name to "draw" our grid layout.
 *
 * You can name each component anything you want, like `salespipe`, or
 * `infotile-active-support-tickets`, but keeping the names to a fixed number of
 * characters makes the "drawing" of the grid look more like the actual grid.
 * One to three characters is probably a good number for most cases.
 *
 * Any "name" that doesn't match a named element will create empty cells. In our
 * case, we use a dot (`.`) to mark empty cells. Empty cells can be put anywhere
 * in the grid, not just at the end.
 *
 * Note that we can add some extra spaces after the dot marking an empty cell,
 * in order to align the next cell in our config-string. This can also be used
 * if your elements have named of differing lengths. The extra whitespace is
 * ignored when the CSS is parsed.
 *
 * If the name of an element does not appear in the grid-configuration, it will
 * not be displayed at all. This might be useful if you wish to show a specific
 * component only under certain circumstances, like if the viewport is large
 * enough to accomodate it.
 */
@Component({
    tag: 'limel-example-grid',
    shadow: true,
    styleUrl: 'grid.scss',
})
export class GridExample {
    public render() {
        return (
            <limel-grid>
                <my-deep-red-component />
                <my-red-component />
                <my-orange-component />
                <my-yellow-component />
                <my-green-component />
                <my-turquoise-component />
                <my-blue-component />
                <my-dark-blue-component />
                <my-magenta-component />
                <my-light-grey-component />
                <my-dark-grey-component />
            </limel-grid>
        );
    }
}
