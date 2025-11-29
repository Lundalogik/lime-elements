import { Plugin, PluginKey } from 'prosemirror-state';
import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { liftListItem, sinkListItem } from 'prosemirror-schema-list';
import {
    liftTaskListItem,
    sinkTaskListItem,
} from './task-list/task-list-commands';

const listIndentationKey = new PluginKey('listIndentation');

export const createListIndentationPlugin = (schema: Schema): Plugin => {
    const listItemType = schema.nodes.list_item;
    const taskListItemType = schema.nodes.task_list_item;

    // Create the task list commands
    const sinkTaskList = sinkTaskListItem(schema);
    const liftTaskList = liftTaskListItem(schema);

    console.log('List indentation plugin initialized');
    console.log('listItemType:', listItemType);
    console.log('taskListItemType:', taskListItemType);

    if (!listItemType && !taskListItemType) {
        console.log('No list types found in schema');
        return new Plugin({
            key: listIndentationKey,
        });
    }

    return keymap({
        Tab: (state, dispatch) => {
            console.log('Tab key pressed in list indentation plugin');
            const { selection } = state;
            const { $from } = selection;

            // Check if we're in any type of list item
            for (let d = $from.depth; d >= 0; d--) {
                const node = $from.node(d);
                console.log(`Tab - Depth ${d}:`, node.type.name, node);

                // Handle regular list items
                if (listItemType && node.type === listItemType) {
                    console.log('Indenting regular list item');
                    return sinkListItem(listItemType)(state, dispatch);
                }

                // Handle task list items
                if (taskListItemType && node.type === taskListItemType) {
                    console.log('Indenting task list item');
                    return sinkTaskList(state, dispatch);
                }
            }

            console.log('Not in a list item, consuming Tab to keep focus');
            // Return true to prevent default browser Tab behavior (losing focus)
            // but don't dispatch any changes since we're not in a list
            return true;
        },
        'Shift-Tab': (state, dispatch) => {
            console.log('Shift-Tab key pressed in list indentation plugin');
            const { selection } = state;
            const { $from } = selection;

            // Check if we're in any type of list item
            for (let d = $from.depth; d >= 0; d--) {
                const node = $from.node(d);
                console.log(`Shift-Tab - Depth ${d}:`, node.type.name, node);

                // Handle regular list items
                if (listItemType && node.type === listItemType) {
                    console.log('Outdenting regular list item');
                    return liftListItem(listItemType)(state, dispatch);
                }

                // Handle task list items
                if (taskListItemType && node.type === taskListItemType) {
                    console.log('Outdenting task list item');
                    return liftTaskList(state, dispatch);
                }
            }

            console.log(
                'Not in a list item, consuming Shift-Tab to keep focus'
            );
            // Return true to prevent default browser Shift-Tab behavior
            return true;
        },
    });
};
