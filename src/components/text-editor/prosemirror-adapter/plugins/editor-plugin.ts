import { PluginKey } from 'prosemirror-state';

export class EditorPlugin<T = any> {
    private key: PluginKey = undefined;

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
}
