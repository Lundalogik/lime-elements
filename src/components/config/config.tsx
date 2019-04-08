import { Component, Prop } from '@stencil/core';
import globalConfig from '../../global/config';

@Component({
    tag: 'limel-config',
    shadow: true,
})
export class Config {
    @Prop()
    public config: object;

    /*
     * Copy any config settings to the global config object
     */
    public componentDidLoad() {
        Object.keys(this.config).forEach(key => {
            globalConfig[key] = this.config[key];
        });
    }

    public render() {
        return null;
    }
}
