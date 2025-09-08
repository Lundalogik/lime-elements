import { Component, Element, h, Prop } from '@stencil/core';

/**
 * Instead of directly using an image element with native lazy loading (`<img loading="lazy">`),
 * you can use this component to get a more advanced lazy loading,
 * which uses the Intersection Observer API to determine when the image is in the viewport.
 *
 * @exampleComponent limel-example-image-basic
 * @exampleComponent limel-example-image-lazy
 * @exampleComponent limel-example-image-interactive
 * @exampleComponent limel-example-image-gallery
 * @exampleComponent limel-example-image-no-source
 * @private
 */
@Component({
    tag: 'limel-image',
    shadow: false,
    styleUrl: 'image.scss',
})
export class ImageComponent {
    /**
     * The image source URL
     */
    @Prop()
    public src: string;

    /**
     * Alternative text for the image
     */
    @Prop()
    public alt: string = '';

    /**
     * Enable lazy loading of the image
     */
    @Prop()
    public lazyLoad = false;

    @Element()
    private host: HTMLLimelImageElement;

    private intersectionObserver: IntersectionObserver | null = null;

    public componentDidRender() {
        this.setupImageIntersectionObserver();
    }

    public disconnectedCallback() {
        this.teardownImageIntersectionObserver();
    }

    public render() {
        if (!this.src) {
            return null;
        }

        const imageProps = {
            alt: this.alt,
            ...(this.lazyLoad ? { 'data-src': this.src } : { src: this.src }),
        };

        return <img {...imageProps} />;
    }

    private setupImageIntersectionObserver() {
        if (!this.src || !this.lazyLoad) {
            return;
        }

        // Create observer if not already created
        if (!this.intersectionObserver) {
            this.intersectionObserver = new IntersectionObserver(
                this.handleImageIntersection
            );
        }

        const root = this.host.shadowRoot ?? this.host;
        const images = root?.querySelectorAll('img') ?? [];

        for (const img of images) {
            this.intersectionObserver?.observe(img);
        }
    }

    private readonly handleImageIntersection = (
        entries: IntersectionObserverEntry[]
    ) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const img = entry.target as HTMLImageElement;
                const dataSrc = img.dataset.src;

                if (dataSrc) {
                    img.setAttribute('src', dataSrc);
                    delete img.dataset.src;
                }

                this.intersectionObserver?.unobserve(img);
            }
        }
    };

    private teardownImageIntersectionObserver() {
        this.intersectionObserver?.disconnect();
        this.intersectionObserver = null;
    }
}
