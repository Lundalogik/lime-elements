import { set } from 'lodash-es';

export function getFullConfig(versions, version) {
    const configs = versions;

    const config = {};
    // eslint-disable-next-line guard-for-in
    for (const i in configs) {
        const route = getRoute(configs[i].configSelector);

        set(config, route, configs[i].config);

        if (configs[i].version >= version) {
            break;
        }
    }

    return config;
}

function getRoute(selector) {
    return selector.split('/');
}
