import { set } from 'lodash-es';
// const deepdiff = require('deep-diff');

// export function getDelta(oldVersion, newVersion) {
//     const oldConfig = getFullConfig(oldVersion);
//     const newConfig = getFullConfig(newVersion);

//     return getDifference(oldConfig, newConfig);
// }

// function getDifference(objectA, objectB) {
//     return deepdiff.diff(objectA, objectB);
// }

export function getFullConfig(versions, version) {
    const configs = versions;

    const config = {};
    for (const i in configs) {
        const route = getRoute(configs[i].configSelector);

        set(config, route, configs[i].config)

        if (configs[i].version >= version) {
            break;
        }
    }

    return config;
}

function getRoute(selector) {
    return selector.split('/');
}
