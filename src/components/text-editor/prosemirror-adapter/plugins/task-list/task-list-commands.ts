import { Command } from 'prosemirror-state';
import {
    wrapInList,
    liftListItem,
    sinkListItem,
} from 'prosemirror-schema-list';
import { Schema } from 'prosemirror-model';
import { CommandWithActive } from '../../menu/menu-commands';

export const createTaskList = (schema: Schema): CommandWithActive => {
    const taskListType = schema.nodes.task_list;
    const taskListItemType = schema.nodes.task_list_item;

    if (!taskListType || !taskListItemType) {
        return () => false;
    }

    const command: Command = wrapInList(taskListType, { checked: false });

    // Add active state detection
    const commandWithActive = command as CommandWithActive;
    commandWithActive.active = (state) => {
        const { $from } = state.selection;
        for (let d = $from.depth; d >= 0; d--) {
            const node = $from.node(d);
            if (node && node.type === taskListType) {
                return true;
            }
        }
        return false;
    };

    return commandWithActive;
};

export const toggleTaskListItem = (schema: Schema): Command => {
    const taskListItemType = schema.nodes.task_list_item;

    return (state, dispatch) => {
        const { from } = state.selection;
        const $from = state.doc.resolve(from);

        // Find the task list item
        for (let d = $from.depth; d >= 0; d--) {
            const node = $from.node(d);
            if (node && node.type === taskListItemType) {
                const pos = $from.before(d);
                const checked = !node.attrs.checked;

                if (dispatch) {
                    const tr = state.tr.setNodeMarkup(pos, null, {
                        ...node.attrs,
                        checked,
                    });
                    dispatch(tr);
                }
                return true;
            }
        }
        return false;
    };
};

export const liftTaskListItem = (schema: Schema): Command => {
    const taskListItemType = schema.nodes.task_list_item;
    return liftListItem(taskListItemType);
};

export const sinkTaskListItem = (schema: Schema): Command => {
    const taskListItemType = schema.nodes.task_list_item;
    return sinkListItem(taskListItemType);
};
