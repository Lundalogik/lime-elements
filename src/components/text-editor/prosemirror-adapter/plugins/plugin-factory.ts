import { Plugin } from 'prosemirror-state';
import { EditorPlugins } from './plugins';
import { limeobjectSelectorPlugin } from './limeobject-selector/limeobject-selector';

export const pluginFactory = (plugin: EditorPlugins): Plugin => {
    if (plugin.getName() === 'limeobjectSelector') {
        return limeobjectSelectorPlugin(plugin);
    }
};
