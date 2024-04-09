import { EditorState, Plugin, PluginKey } from 'prosemirror-state';

/**
 * Create a plugin that allows you to set the editor to readonly mode
 * disabling user interaction with the editor
 *
 * @param readonly - the initial state of the plugin
 * @param readonlyKey - the key of the plugin
 * @returns the plugin
 */
export const createReadOnlyPlugin = (
    readonly: boolean,
    readonlyKey: PluginKey,
): Plugin => {
    return new Plugin({
        key: readonlyKey,
        state: {
            init: () => readonly,
            apply: (tr, oldState: EditorState) => {
                const readonlyVal = tr.getMeta(readonlyKey);

                if (readonlyVal === undefined) {
                    return oldState;
                } else {
                    return readonlyVal;
                }
            },
        },
        props: {
            editable: (state) => {
                return !readonlyKey.getState(state);
            },
        },
    });
};
