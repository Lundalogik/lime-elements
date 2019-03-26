
(function(namespace,resourcesUrl){"use strict";
(function(Context, resourcesUrl){
    /** LimeElements global **/

    class Config {
        constructor() {
            this.iconPath = '';
        }
    }
    const config = new Config();
    var config$1 = (() => {
        return config;
    })();

    class IconCache {
        constructor() {
            /*
             * Cache of all loaded SVGs
             */
            this.cache = {};
            /*
             * Contains resolve functions for all unresolved promises that are waiting for SVG data.
             */
            this.resolveFunctions = {};
        }
        /**
         * Get icon data from the cache
         *
         * @param {string} name name of the icon
         * @param {string} path path on the server where the assets are located
         *
         * @returns {string} svg markup
         */
        async get(name, path = '') {
            if (!this.cache[name]) {
                this.cache[name] = await this.getIcon(name, path);
            }
            return this.cache[name];
        }
        /*
         * Creates and returns a promise that will be resolved when SVG data is available
         */
        getIcon(name, path) {
            return new Promise(resolve => {
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
        async fetchData(name, path) {
            let iconPath = path || '';
            if (path && !path.endsWith('/')) {
                iconPath = `${path}/`;
            }
            const response = await fetch(`${iconPath}assets/icons/${name}.svg`);
            let svgData = await response.text();
            // Some of the icons in the Icons8 library have hard coded black color on some of the paths.
            // In order to apply coloring with CSS, these have to be set to 'currentColor'
            svgData = svgData.replace(/#000000/g, 'currentColor');
            if (!this.validSvg(svgData)) {
                throw new Error('Invalid SVG');
            }
            this.resolvePromises(name, svgData);
        }
        /*
         * Check if the given data is a valid SVG document
         */
        validSvg(data) {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(data, 'image/svg+xml');
            return svgDoc.documentElement.tagName.toLowerCase() === 'svg';
        }
        /*
         * Resolve all promises waiting for data for a specific icon
         */
        resolvePromises(name, svgData) {
            const resolves = this.resolveFunctions[name];
            resolves.forEach(resolve => {
                resolve(svgData);
            });
            this.resolveFunctions[name] = null;
        }
    }
    const cache = new IconCache();
    var iconCache = (() => {
        return cache;
    })();

    var da = {
        'date-picker.month.heading': 'Måned',
        'date-picker.quarter.heading': 'Kvartal',
        'date-picker.year.heading': 'År',
    };

    var en = {
        'date-picker.month.heading': 'Month',
        'date-picker.quarter.heading': 'Quarter',
        'date-picker.year.heading': 'Year',
    };

    var fi = {
        'date-picker.month.heading': 'Kuukausi',
        'date-picker.quarter.heading': 'Vuosineljännes',
        'date-picker.year.heading': 'Vuosi',
    };

    var no = {
        'date-picker.month.heading': 'Måned',
        'date-picker.quarter.heading': 'Kvartal',
        'date-picker.year.heading': 'År',
    };

    var sv = {
        'date-picker.month.heading': 'Månad',
        'date-picker.quarter.heading': 'Kvartal',
        'date-picker.year.heading': 'År',
    };

    const allTranslations = { da: da, en: en, fi: fi, no: no, sv: sv };
    class Translations {
        get(key, language = 'en') {
            return allTranslations[language][key];
        }
    }
    const translations = new Translations();
    var translations$1 = (() => {
        return translations;
    })();

    Context.config = config$1;
    Context.iconCache = iconCache;
    Context.translations = translations$1;
})(x,r);
})("LimeElements");