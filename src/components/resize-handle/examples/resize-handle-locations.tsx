import { Component, h, State } from '@stencil/core';

type Location = 'left' | 'right' | 'top' | 'bottom';

const LOCATIONS: Location[] = ['left', 'right', 'top', 'bottom'];
const MIN_SIZE = 120;
const MAX_SIZE = 200;

/**
 * Locations
 *
 * The handle can be on any edge of the element that it resizes. Set the
 * location with `location`. The handle resizes the width when it is on the
 * left or the right, and the height when it is at the top or the bottom. In
 * this example, each element shows the `location` of its handle, and the
 * `value` of the handle, which is the width or the height in pixels.
 *
 * Arrow keys move the handle in the same way as the pointer does. For example,
 * <kbd>↑</kbd> makes the element higher when the handle is at the top, and
 * <kbd>↓</kbd> makes it lower.
 */
@Component({
    tag: 'limel-example-resize-handle-locations',
    shadow: true,
    styleUrl: 'resize-handle-locations.scss',
})
export class ResizeHandleLocationsExample {
    @State()
    private sizes: Record<Location, number> = {
        left: 160,
        right: 160,
        top: 140,
        bottom: 140,
    };

    public render() {
        return LOCATIONS.map(this.renderResizableElement);
    }

    private renderResizableElement = (location: Location) => {
        const size = this.sizes[location];
        const dimension = ['left', 'right'].includes(location)
            ? 'width'
            : 'height';

        return (
            <section data-location={location}>
                <div style={{ [dimension]: `${size}px` }}>
                    <limel-resize-handle
                        resizableRegionLabel={`element with its handle at the ${location}`}
                        location={location}
                        value={size}
                        min={MIN_SIZE}
                        max={MAX_SIZE}
                        onChangeSize={this.handleChangeSize(location)}
                    />
                    <p>
                        <code>location</code>: {location}
                    </p>
                    <p>
                        <code>value</code>: {size}
                    </p>
                </div>
            </section>
        );
    };

    private handleChangeSize = (location: Location) => {
        return (event: CustomEvent<number>) => {
            const size = Math.min(Math.max(event.detail, MIN_SIZE), MAX_SIZE);
            this.sizes = { ...this.sizes, [location]: Math.round(size) };
        };
    };
}
