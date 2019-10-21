import { r as registerInstance } from './core-804afdbc.js';
import { c as config } from './config-9a1dfec5.js';

const Config = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    /*
     * Copy any config settings to the global config object
     */
    componentDidLoad() {
        Object.keys(this.config).forEach(key => {
            config[key] = this.config[key];
        });
    }
    render() {
        return null;
    }
};

export { Config as limel_config };
