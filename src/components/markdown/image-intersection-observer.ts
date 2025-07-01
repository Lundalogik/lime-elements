export class ImageIntersectionObserver {
    private observer: IntersectionObserver;

    /**
     * @param containerElement - The element containing images to observe.
     */
    public constructor(containerElement: HTMLElement) {
        this.observer = new IntersectionObserver(this.handleIntersection);

        const images = containerElement.querySelectorAll('img');
        for (const img of images) {
            this.observer.observe(img);
        }
    }

    public disconnect() {
        this.observer.disconnect();
    }

    private readonly handleIntersection = (
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

                this.observer.unobserve(img);
            }
        }
    };
}
