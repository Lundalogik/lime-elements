import { Component, Prop } from '@stencil/core';
import { globalConfig } from '../../global/config';

/**
 * @private
 */
@Component({
    tag: 'limel-config',
    shadow: true,
})
export class Config {
    /**
     * Global configuration for Lime Elements
     */
    @Prop()
    public config: {
        iconPath?: string;
        defaultLocale?: string;
        featureSwitches: any;
    };

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
