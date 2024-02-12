import { Component, Prop } from '@stencil/core';
import { Config, globalConfig } from '../../global/config';

/**
 * @private
 */
@Component({
    tag: 'limel-config',
    shadow: true,
})
export class ConfigComponent {
    /**
     * Global configuration for Lime Elements.
     */
    @Prop()
    public config: Config;

    public componentDidLoad() {
        this.setGlobalConfig();
    }

    public componentDidUpdate() {
        this.setGlobalConfig();
    }

    /*
     * Copy any config settings to the global config object
     */
    private setGlobalConfig() {
        if (!this.config) {
            return;
        }

        Object.keys(this.config).forEach((key) => {
            globalConfig[key] = this.config[key];
        });
    }

    public render() {
        return null;
    }
}
