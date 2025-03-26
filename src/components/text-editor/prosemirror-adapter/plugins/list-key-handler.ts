import { Plugin, PluginKey } from 'prosemirror-state';
import { sinkListItem, liftListItem } from 'prosemirror-schema-list';
import { Schema } from 'prosemirror-model';

export const listKeyHandlerPluginKey = new PluginKey('listKeyHandlerPlugin');

/**
 * Checks if the current cursor position is within a list item
 */
export function isInListItem(state) {
    const { $from } = state.selection;
    let depth = $from.depth;

    // Traverse up the node hierarchy
    while (depth > 0) {
        const node = $from.node(depth);
        if (node.type.name === 'list_item') {
            return true;
        }

        depth--;
    }

    return false;
}

/**
 * Creates a plugin for handling keydown events specific to lists
 * - Tab: indent list item (when in a list)
 * - Shift+Tab: outdent list item (when in a list)
 *
 * @param schema - The document schema
 * @returns A ProseMirror plugin for handling list-specific key events
 */
export function createListKeyHandlerPlugin(schema: Schema) {
    return new Plugin({
        key: listKeyHandlerPluginKey,
        props: {
            handleKeyDown: (view, event) => {
                const { state } = view;

                // Only handle Tab and Shift+Tab
                if (event.key !== 'Tab') {
                    return false;
                }

                // Only act when in a list item
                if (!isInListItem(state)) {
                    return false;
                }

                // Handle indent (Tab)
                if (!event.shiftKey) {
                    event.preventDefault();

                    return sinkListItem(schema.nodes.list_item)(
                        state,
                        view.dispatch,
                    );
                }

                // Handle outdent (Shift+Tab)
                if (event.shiftKey) {
                    event.preventDefault();

                    return liftListItem(schema.nodes.list_item)(
                        state,
                        view.dispatch,
                    );
                }

                return false;
            },
        },
    });
}
