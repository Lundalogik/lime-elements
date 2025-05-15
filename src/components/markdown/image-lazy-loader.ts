export class ImageLazyLoader {
    private observer: IntersectionObserver;

    /**
     * Setup lazy loading for all images in a container element
     * @param containerElement - The element containing images to lazy load
     */
    public setupLazyLoading(containerElement: HTMLElement) {
        this.disconnect();

        const images = containerElement.querySelectorAll('img');
        if (!images.length) {
            return;
        }

        this.observer = new IntersectionObserver(this.handleIntersection);

        images.forEach((img) => {
            this.observer.observe(img);
        });
    }

    public disconnect() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    private readonly handleIntersection = (
        entries: IntersectionObserverEntry[],
    ) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target as HTMLImageElement;
                const dataSrc = img.getAttribute('data-src');

                if (dataSrc) {
                    img.setAttribute('src', dataSrc);
                    img.removeAttribute('data-src');
                }

                this.observer.unobserve(img);
            }
        });
    };
}
