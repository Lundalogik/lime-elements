export class ImageIntersectionObserver {
    private observer: IntersectionObserver;

    /**
     * @param containerElement - The element containing images to observe.
     */
    public constructor(containerElement: HTMLElement) {
        this.observer = new IntersectionObserver(this.handleIntersection);

        const images = containerElement.querySelectorAll('img');
        images.forEach((img) => {
            this.observer.observe(img);
        });
    }

    public disconnect() {
        this.observer.disconnect();
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
