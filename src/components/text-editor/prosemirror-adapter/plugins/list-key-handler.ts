import { Plugin, PluginKey } from 'prosemirror-state';
import {
    sinkListItem,
    liftListItem,
    splitListItem,
} from 'prosemirror-schema-list';
import { Schema } from 'prosemirror-model';
import { chainCommands, joinBackward } from 'prosemirror-commands';

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
 * Checks if the current list item is empty (contains only an empty paragraph)
 */
export function isEmptyListItem(state) {
    const { $from } = state.selection;
    let depth = $from.depth;

    // Find the list item node
    while (depth > 0) {
        const node = $from.node(depth);
        if (node.type.name === 'list_item') {
            // Check if it contains only an empty paragraph
            return (
                node.childCount === 1 &&
                node.firstChild.type.name === 'paragraph' &&
                node.firstChild.content.size === 0
            );
        }

        depth--;
    }

    return false;
}

/**
 * Checks if the cursor is at the start of a list item
 */
export function isAtStartOfListItem(state) {
    const { $from, empty } = state.selection;

    // Only relevant for collapsed selections (cursor)
    if (!empty) {
        return false;
    }

    // Find the list item node
    for (let depth = $from.depth; depth > 0; depth--) {
        const node = $from.node(depth);
        if (node.type.name === 'list_item') {
            // Get the start position of the list item's content
            const startPos = $from.start(depth);

            // Check if the cursor is at the start of the list item's content
            return $from.pos === startPos;
        }
    }

    return false;
}

/**
 * Creates a plugin for handling keydown events specific to lists
 * - Tab: indent list item (when in a list)
 * - Shift+Tab: outdent list item (when in a list)
 * - Enter: split list item or exit list if empty
 * - Backspace: join with previous item or lift out of list
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

                // Only act when in a list item
                if (!isInListItem(state)) {
                    return false;
                }

                // Handle Tab and Shift+Tab
                if (event.key === 'Tab') {
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
                }

                // Handle Enter key
                if (
                    event.key === 'Enter' &&
                    !event.shiftKey &&
                    !event.ctrlKey &&
                    !event.altKey &&
                    !event.metaKey
                ) {
                    event.preventDefault();

                    // If list item is empty, exit the list
                    if (isEmptyListItem(state)) {
                        return liftListItem(schema.nodes.list_item)(
                            state,
                            view.dispatch,
                        );
                    }

                    // Otherwise split the list item
                    return splitListItem(schema.nodes.list_item)(
                        state,
                        view.dispatch,
                    );
                }

                // Handle Backspace key
                if (
                    event.key === 'Backspace' &&
                    !event.shiftKey &&
                    !event.ctrlKey &&
                    !event.altKey &&
                    !event.metaKey
                ) {
                    // Only handle backspace at the start of a list item
                    if (isAtStartOfListItem(state)) {
                        event.preventDefault();

                        // Try joinBackward first (join with previous list item)
                        // If that fails, try to lift the list item out
                        return chainCommands(
                            joinBackward,
                            liftListItem(schema.nodes.list_item),
                        )(state, view.dispatch);
                    }
                }

                return false;
            },
        },
    });
}
