import { Component, h } from '@stencil/core';

/**
 * Basic image
 *
 * A simple image component that displays an image with alternative text.
 * The image loads immediately when rendered.
 */
@Component({
    tag: 'limel-example-image-basic',
    shadow: true,
})
export class ImageBasicExample {
    public render() {
        return (
            <limel-image
                src="https://picsum.photos/400/300"
                alt="A beautiful random image from Lorem Picsum"
            />
        );
    }
}
