import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

/**
 * Create a plugin that allows you to disable the editor
 * Changes the font opacity based on the disabled state
 *
 * @param disabled - the initial state of the plugin
 * @param disabledKey - the key of the plugin
 * @returns the plugin
 */
export const createDisabledPlugin = (
    disabled: boolean,
    disabledKey: PluginKey,
): Plugin => {
    return new Plugin({
        key: disabledKey,
        view: (editorView: EditorView) => {
            return {
                update: (view: EditorView) => {
                    if (disabledKey.getState(view.state) === true) {
                        view.dom.style.opacity = '0.5';
                    } else {
                        view.dom.style.opacity = '1.0';
                    }
                },
                destroy: () => {
                    editorView.dom.style.opacity = '1.0';
                },
            };
        },
        state: {
            init: () => disabled,
            apply: (tr, oldState: EditorState) => {
                const readonlyVal = tr.getMeta(disabledKey);

                if (readonlyVal === undefined) {
                    return oldState;
                } else {
                    return readonlyVal;
                }
            },
        },
        props: {
            editable: (state) => {
                return !disabledKey.getState(state);
            },
        },
    });
};
