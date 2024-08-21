import { Plugin, PluginKey } from 'prosemirror-state';

export class CustomEditorPlugin<T = any> {
    private key: PluginKey;

    constructor(
        private props: T,
        private name: string,
    ) {
        this.key = new PluginKey(name);
    }

    public getPluginKey(): PluginKey {
        return this.key;
    }

    public getName(): string {
        return this.name;
    }

    public getProps(): T {
        return this.props;
    }

    public createPlugin(): Plugin {
        return new Plugin({
            key: this.getPluginKey(),
            props: this.getProps(),
        });
    }
}

export const pluginFactory = (plugin: CustomEditorPlugin): Plugin => {
    return plugin.createPlugin();
};
