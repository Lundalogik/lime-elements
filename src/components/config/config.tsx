import { Component, Prop } from '@stencil/core';
import { Config, globalConfig } from '../../global/config';

/**
 * Component used to set global configuration for Lime Elements.
 *
 * :::warning
 * **Building something for Lime CRM?** Then you should _NOT_ use this component.
 * Lime CRM already uses this component to set the global configuration for
 * Lime Elements. No matter what problem you are facing at the moment, using
 * this component will not help, and might cause other problems.
 * :::
 *
 * Building your own software, which is using Lime Elements?
 * Then you _might_ need to use this component.
 *
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

        for (const key of Object.keys(this.config)) {
            globalConfig[key] = this.config[key];
        }
    }

    public render() {
        return null;
    }
}
