import { Component, h } from '@stencil/core';

/**
 * Lazy loaded image
 *
 * This example demonstrates lazy loading functionality. The image will only
 * be loaded when it enters the viewport, which improves performance by
 * reducing initial page load time and bandwidth usage.
 *
 * :::tip
 * Lazy loading is particularly useful for pages with many images,
 * or long scrollable content.
 * :::
 */
@Component({
    tag: 'limel-example-image-lazy',
    shadow: true,
    styleUrl: 'image-lazy.scss',
})
export class ImageLazyExample {
    public render() {
        return [
            <p>Scroll down to see the lazy loaded image...</p>,
            <div class="spacer"></div>,
            <limel-image
                src="https://picsum.photos/600/400?random=1"
                alt="A lazy loaded image that appears when scrolled into view"
                lazyLoad={true}
            />,
        ];
    }
}
