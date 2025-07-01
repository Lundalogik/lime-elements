export class InMemoryIconCache {
    /*
     * Cache of all loaded SVGs
     */
    private cache = {};

    /*
     * Contains resolve functions for all unresolved promises that are waiting for SVG data.
     */
    private resolveFunctions = {};

    /**
     * Get icon data from the cache
     *
     * @param name - Name of the icon
     * @param path - Path on the server where the assets are located
     * @returns SVG markup
     */
    public async get(name: string, path = ''): Promise<string> {
        if (!this.cache[name]) {
            this.cache[name] = await this.getIcon(name, path);
        }

        return this.cache[name];
    }

    /*
     * Creates and returns a promise that will be resolved when SVG data is available
     */
    private getIcon(name, path) {
        return new Promise((resolve) => {
            if (!this.resolveFunctions[name]) {
                this.resolveFunctions[name] = [];
                this.fetchData(name, path);
            }

            this.resolveFunctions[name].push(resolve);
        });
    }

    /*
     * Fetch SVG data from the server
     */
    private async fetchData(name, path) {
        let iconPath = path || '';
        if (path && !path.endsWith('/')) {
            iconPath = `${path}/`;
        }

        const response = await fetch(`${iconPath}assets/icons/${name}.svg`);

        let svgData = await response.text();

        // Some of the icons in the Icons8 library have hard coded black color on some of the paths.
        // In order to apply coloring with CSS, these have to be set to 'currentColor'
        svgData = svgData.replaceAll('#000000', 'currentColor');
        if (!this.validSvg(svgData)) {
            throw new Error('Invalid SVG');
        }

        this.resolvePromises(name, svgData);
    }

    /*
     * Check if the given data is a valid SVG document
     */
    private validSvg(data) {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(data, 'image/svg+xml');

        return svgDoc.documentElement.tagName.toLowerCase() === 'svg';
    }

    /*
     * Resolve all promises waiting for data for a specific icon
     */
    private resolvePromises(name, svgData) {
        const resolves = this.resolveFunctions[name];
        for (const resolve of resolves) {
            resolve(svgData);
        }
        this.resolveFunctions[name] = null;
    }
}
