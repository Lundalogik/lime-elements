import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

/**
 * Create a plugin that adds a placeholder to the editor
 * Adds a dummy text on the view if the editor has
 * not been filled in
 *
 * @param placeholder - the initial placeholder for the plugin
 * @param placeholderKey - the key of the plugin
 * @returns the plugin
 */
export const createPlaceholderPlugin = (
    placeholder: string,
    placeholderKey: PluginKey,
): Plugin => {
    return new Plugin({
        key: placeholderKey,
        state: {
            init: () => placeholder,
            apply: (tr, oldState: EditorState) => {
                const text = tr.getMeta(placeholderKey);
                if (text === undefined) {
                    return oldState;
                } else {
                    return text;
                }
            },
        },
        props: {
            decorations: (state) => {
                if (
                    state.doc.textContent !== '' ||
                    placeholderKey.getState(state) === undefined
                ) {
                    return undefined;
                }

                const placeholderNode = document.createTextNode(
                    placeholderKey.getState(state),
                );
                const widget: Decoration = Decoration.widget(
                    state.doc.content.size - 1,
                    () => placeholderNode,
                );

                return DecorationSet.create(state.doc, [widget]);
            },
        },
    });
};
