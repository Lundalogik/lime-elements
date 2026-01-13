import { Plugin, PluginKey } from 'prosemirror-state';
import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { splitListItem } from 'prosemirror-schema-list';

const taskListKey = new PluginKey('taskList');

export const createTaskListPlugin = (schema: Schema): Plugin => {
    const taskListItemType = schema.nodes.task_list_item;
    const listItemType = schema.nodes.list_item; // Also check regular list items

    console.log('Task list plugin initialized');
    console.log('taskListItemType:', taskListItemType);
    console.log('listItemType:', listItemType);

    if (!taskListItemType) {
        console.log('No task_list_item type found in schema');
        return new Plugin({
            key: taskListKey,
        });
    }

    return keymap({
        Enter: (state, dispatch) => {
            console.log('Enter key pressed in task list plugin');

            // Debug: check what type of node we're in
            const { selection } = state;
            const { $from } = selection;

            for (let d = $from.depth; d >= 0; d--) {
                const node = $from.node(d);
                console.log(`Depth ${d}:`, node.type.name, node.attrs);

                if (node.type === taskListItemType) {
                    console.log('Found task_list_item, using splitListItem');
                    return splitListItem(taskListItemType)(state, dispatch);
                }
            }

            console.log('Not in a task_list_item, allowing other handlers');
            return false;
        },
        // Removed Mod-[ and Mod-] - now handled by list indentation plugin
    });
};
