import { Config } from '@stencil/core';

export const nodeResolve: Config['nodeResolve'] = {
    browser: false,
    exportConditions: ['default', 'module', 'import', 'production'],
    mainFields: ['module', 'main'],
};
