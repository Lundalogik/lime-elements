import { CustomElementDefinition } from './shared-types/custom-element.types';

/**
 * Configuration options for limel-config.
 *
 * @public
 */
export type Config = {
    /**
     * The path to where the icon library used by limel-icon is located.
     */
    iconPath?: string;

    /**
     * The default locale to use for components that support localization.
     */
    defaultLocale?: string;

    /**
     * Whitelisted html elements for `limel-markdown`.
     *
     * Any custom element added here will not be sanitized and thus rendered.
     * @alpha
     */
    markdownWhitelist?: CustomElementDefinition[];

    /**
     * @internal
     */
    featureSwitches?: Record<string, boolean>;
};

class ConfigClass implements Config {
    public iconPath = '';
    public defaultLocale = navigator.language;
    public markdownWhitelist?: CustomElementDefinition[];
    public featureSwitches: any = getFeatureSwitches(localStorage);
}

function getFeatureSwitches(storage: Storage) {
    const features = {};
    for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        const value = storage.getItem(key);

        if (!['true', 'false'].includes(value)) {
            continue;
        }

        features[key] = value === 'true';
    }

    return features;
}

const config = new ConfigClass();
export const globalConfig = (() => {
    return config;
})();
