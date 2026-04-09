import { Component, h } from '@stencil/core';

/**
 * Basic example
 *
 * This example shows how to use the masonry layout to arrange
 * cards of varying heights into a Pinterest-like grid.
 *
 * The component offers two custom css properties to control the layout:
 * - `--masonry-layout-min-column-width` which defaults to `12rem`, and
 * - `--masonry-layout-gap` which defaults to `1rem`.
 *
 * These variables enable you to easily customize the layout to
 * fit your needs, using media queries or container queries if desired.
 *
 * :::important
 * Values must be specified in `rem` or `px`.
 * Complex expressions like `calc()` or relative units like `%`
 * and `em` are not supported.
 * :::
 */
@Component({
    tag: 'limel-example-masonry-layout-basic',
    styleUrl: 'masonry-layout-basic.scss',
    shadow: true,
})
export class MasonryLayoutBasicExample {
    private readonly items = [
        { title: '1. Mountain Lake', height: 6 },
        { title: '2. City Skyline', height: 3 },
        { title: '3. Forest Path', height: 9 },
        { title: '4. Ocean Sunset', height: 5.5 },
        { title: '5. Desert Dunes', height: 7 },
        { title: '6. Snowy Peaks', height: 5 },
        { title: '7. Tropical Beach', height: 6.5 },
        { title: '8. Autumn Leaves', height: 4.5 },
        { title: '9. Northern Lights', height: 9.5 },
        { title: '10. Coral Reef', height: 2 },
        { title: '11. Bamboo Grove', height: 6.5 },
        { title: '12. Volcano', height: 6 },
    ];

    public render() {
        return (
            <section>
                <limel-masonry-layout>
                    {this.items.map((item) =>
                        this.renderCard(item.title, item.height)
                    )}
                </limel-masonry-layout>
            </section>
        );
    }

    private renderCard(title: string, height: number) {
        return (
            <div class="card" style={{ height: `${height}rem` }}>
                <h3>{title}</h3>
            </div>
        );
    }
}
