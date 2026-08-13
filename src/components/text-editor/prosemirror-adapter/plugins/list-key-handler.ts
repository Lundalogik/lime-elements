import { Plugin, PluginKey } from 'prosemirror-state';
import { sinkListItem, liftListItem } from 'prosemirror-schema-list';
import { Schema } from 'prosemirror-model';
import { findAncestorDepthOfType } from '../menu/menu-command-utils/node-utils';

export const listKeyHandlerPluginKey = new PluginKey('listKeyHandlerPlugin');

/**
 * Creates a plugin for handling Tab and Shift+Tab inside list items:
 * Tab indents the item and Shift+Tab outdents it. Enter and Backspace
 * are handled by the base keymap (splitListItem and joinBackward), which
 * runs before this plugin.
 *
 * @param schema - The document schema
 * @returns A ProseMirror plugin for handling list-specific key events
 */
export function createListKeyHandlerPlugin(schema: Schema) {
    return new Plugin({
        key: listKeyHandlerPluginKey,
        props: {
            handleKeyDown: (view, event) => {
                if (event.key !== 'Tab') {
                    return false;
                }

                const { state } = view;
                const { $from } = state.selection;
                const inListItem =
                    findAncestorDepthOfType($from, schema.nodes.list_item) !==
                    null;

                if (!inListItem) {
                    return false;
                }

                // Inside a list item, Tab and Shift+Tab are always handled
                // so focus never leaves the editor mid-list, even when the
                // indent or outdent itself cannot apply.
                event.preventDefault();

                if (event.shiftKey) {
                    liftListItem(schema.nodes.list_item)(state, view.dispatch);

                    return true;
                }

                // Sinking fails on first items (no preceding sibling to
                // become the parent); Tab is still swallowed.
                sinkListItem(schema.nodes.list_item)(state, view.dispatch);

                return true;
            },
        },
    });
}
