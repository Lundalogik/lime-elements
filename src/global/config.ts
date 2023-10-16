export class Config {
    public iconPath = '';
    public defaultLocale = navigator.language;
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

const config = new Config();
export default (() => {
    return config;
})();
