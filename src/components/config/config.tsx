import { Component, Prop } from '@stencil/core';

@Component({
    tag: 'limel-config',
    shadow: true,
})
export class Config {
    @Prop()
    public config: object;

    @Prop({ context: 'config' })
    public globalConfig: Config;

    /*
     * Copy any config settings to the global config object
     */
    public componentDidLoad() {
        Object.keys(this.config).forEach(key => {
            this.globalConfig[key] = this.config[key];
        });
    }

    public render() {
        return null;
    }
}
