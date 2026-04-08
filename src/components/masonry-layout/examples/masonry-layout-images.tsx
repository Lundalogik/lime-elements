import { Component, h } from '@stencil/core';

/**
 * With images
 *
 * This example demonstrates a classic masonry use case: a photo gallery
 * with images of varying aspect ratios.
 * The images have different natural heights, so the masonry layout
 * fills in the gaps by placing each image in the shortest column.
 */
@Component({
    tag: 'limel-example-masonry-layout-images',
    styleUrl: 'masonry-layout-images.scss',
    shadow: true,
})
export class MasonryLayoutImagesExample {
    private readonly images = [
        { id: 1015, width: 400, height: 300 },
        { id: 1018, width: 400, height: 600 },
        { id: 1025, width: 400, height: 265 },
        { id: 1035, width: 400, height: 550 },
        { id: 1039, width: 400, height: 250 },
        { id: 1043, width: 400, height: 375 },
        { id: 1050, width: 400, height: 500 },
        { id: 1055, width: 400, height: 275 },
        { id: 1060, width: 400, height: 450 },
        { id: 1069, width: 400, height: 240 },
        { id: 1073, width: 400, height: 575 },
        { id: 1080, width: 400, height: 325 },
    ];

    public render() {
        return (
            <section>
                <limel-masonry-layout>
                    {this.images.map((image) => this.renderImage(image))}
                </limel-masonry-layout>
            </section>
        );
    }

    private renderImage(image: { id: number; width: number; height: number }) {
        const src = `https://picsum.photos/id/${image.id}/${image.width}/${image.height}`;

        return (
            <div class="card">
                <img
                    src={src}
                    alt={`Photo ${image.id}`}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                />
            </div>
        );
    }
}
