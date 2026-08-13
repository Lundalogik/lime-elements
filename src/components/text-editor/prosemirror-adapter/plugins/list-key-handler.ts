import { Plugin, PluginKey } from 'prosemirror-state';
import {
    sinkListItem,
    liftListItem,
    splitListItem,
} from 'prosemirror-schema-list';
import { Node, Schema } from 'prosemirror-model';
import { chainCommands, joinBackward } from 'prosemirror-commands';
import { findAncestorDepthOfType } from '../menu/menu-command-utils/node-utils';

export const listKeyHandlerPluginKey = new PluginKey('listKeyHandlerPlugin');

const isEmptyListItem = (item: Node, schema: Schema): boolean =>
    item.childCount === 1 &&
    item.firstChild.type === schema.nodes.paragraph &&
    item.firstChild.content.size === 0;

const isPlainKey = (event: KeyboardEvent): boolean =>
    !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey;

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
                const { $from, empty } = state.selection;
                const listItemDepth = findAncestorDepthOfType(
                    $from,
                    schema.nodes.list_item
                );

                // Only act when in a list item
                if (listItemDepth === null) {
                    return false;
                }

                // Inside a list item, Tab and Shift+Tab are always handled
                // so focus never leaves the editor mid-list, even when the
                // indent or outdent itself cannot apply.
                if (event.key === 'Tab') {
                    event.preventDefault();

                    if (event.shiftKey) {
                        liftListItem(schema.nodes.list_item)(
                            state,
                            view.dispatch
                        );

                        return true;
                    }

                    // Sinking fails on first items (no preceding sibling to
                    // become the parent); Tab is still swallowed.
                    sinkListItem(schema.nodes.list_item)(state, view.dispatch);

                    return true;
                }

                // Handle Enter key
                if (event.key === 'Enter' && isPlainKey(event)) {
                    event.preventDefault();

                    // If list item is empty, exit the list
                    if (isEmptyListItem($from.node(listItemDepth), schema)) {
                        return liftListItem(schema.nodes.list_item)(
                            state,
                            view.dispatch
                        );
                    }

                    // Otherwise split the list item
                    return splitListItem(schema.nodes.list_item)(
                        state,
                        view.dispatch
                    );
                }

                // Handle Backspace key, only at the start of a list item
                if (
                    event.key === 'Backspace' &&
                    isPlainKey(event) &&
                    empty &&
                    $from.pos === $from.start(listItemDepth)
                ) {
                    event.preventDefault();

                    // Try joinBackward first (join with previous list item)
                    // If that fails, try to lift the list item out
                    return chainCommands(
                        joinBackward,
                        liftListItem(schema.nodes.list_item)
                    )(state, view.dispatch);
                }

                return false;
            },
        },
    });
}
