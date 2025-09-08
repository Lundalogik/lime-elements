import { Component, h } from '@stencil/core';
import { Image } from '../../../global/shared-types/image.types';

/**
 * Gallery of images
 *
 * This example demonstrates multiple images in a grid layout,
 * showcasing different sizes and aspect ratios. Some images use
 * lazy loading for performance optimization.
 */
@Component({
    tag: 'limel-example-image-gallery',
    shadow: true,
    styleUrl: 'image-gallery.scss',
})
export class ImageGalleryExample {
    private images: Image[] = [
        {
            src: 'https://picsum.photos/300/200?random=10',
            alt: 'Landscape photo 1',
            loading: 'eager',
        },
        {
            src: 'https://picsum.photos/300/300?random=11',
            alt: 'Square photo',
            loading: 'lazy',
        },
        {
            src: 'https://picsum.photos/200/300?random=12',
            alt: 'Portrait photo',
            loading: 'lazy',
        },
        {
            src: 'https://picsum.photos/400/250?random=13',
            alt: 'Wide landscape photo',
            loading: 'lazy',
        },
        {
            src: 'https://picsum.photos/250/250?random=14',
            alt: 'Square photo 2',
            loading: 'lazy',
        },
        {
            src: 'https://picsum.photos/350/200?random=15',
            alt: 'Landscape photo 2',
            loading: 'lazy',
        },
    ];

    public render() {
        return (
            <div class="gallery">
                {this.images.map((image, index) => (
                    <div key={index} class="gallery-item">
                        <limel-image
                            src={image.src}
                            alt={image.alt}
                            lazyLoad={image.loading === 'lazy'}
                        />
                    </div>
                ))}
            </div>
        );
    }
}
