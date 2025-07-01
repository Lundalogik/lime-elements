export class CacheStorageIconCache {
    /*
     * Cache of all loaded SVGs
     */
    private cache: Promise<Cache>;

    private promises: Record<string, Promise<void>> = {};

    constructor(cache: Promise<Cache>) {
        this.cache = cache;
    }

    /**
     * Get icon data from the cache
     *
     * @param name - Name of the icon
     * @param path - Path on the server where the assets are located
     * @returns SVG markup
     */
    public async get(name: string, path = ''): Promise<string> {
        const cache = await this.cache;
        const url = this.getUrl(name, path);

        let response = await cache.match(url);
        if (!response) {
            response = await this.fetchData(url, cache);
        }

        return this.getIcon(response);
    }

    private async fetchData(url: string, cache: Cache): Promise<Response> {
        let requestPromise = this.promises[url];
        if (requestPromise === undefined) {
            requestPromise = cache.add(url);
            this.promises[url] = requestPromise;
        }

        await requestPromise;

        return cache.match(url);
    }

    /*
     * Get icon data from a response
     */
    private async getIcon(response: Response): Promise<string> {
        let svgData = await response.text();

        // Some of the icons in the Icons8 library have hard coded black color on some of the paths.
        // In order to apply coloring with CSS, these have to be set to 'currentColor'
        svgData = svgData.replaceAll('#000000', 'currentColor');

        if (!this.validSvg(svgData)) {
            throw new Error('Invalid SVG');
        }

        return svgData;
    }

    /*
     * Check if the given data is a valid SVG document
     */
    private validSvg(data) {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(data, 'image/svg+xml');

        return svgDoc.documentElement.tagName.toLowerCase() === 'svg';
    }

    private getUrl(name: string, path: string): string {
        let iconPath = path || '';
        if (path && !path.endsWith('/')) {
            iconPath = `${path}/`;
        }

        return `${iconPath}assets/icons/${name}.svg`;
    }
}
