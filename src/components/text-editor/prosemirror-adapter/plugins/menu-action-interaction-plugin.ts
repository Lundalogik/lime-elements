import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { MenuCommandFactory, MenuCommandOptions } from '../menu/menu-commands';
import { EditorMenuTypes } from '../menu/types';

export const actionBarInteractionPluginKey = new PluginKey(
    'actionBarInteractionPlugin'
);

const dispatchMenuCommand = (command, view) => {
    const { state } = view;
    const selection = state.selection;
    let transaction = state.tr;
    if (!selection.empty) {
        transaction.setSelection(selection);
    }

    command(state, (tr) => {
        transaction = tr;
    });
    view.dispatch(transaction);
    view.focus();
};

const executeMenuCommand = (
    menuCommandFactory: MenuCommandFactory,
    view: EditorView,
    type: EditorMenuTypes,
    options?: MenuCommandOptions
) => {
    try {
        const command = menuCommandFactory.getCommand(type, options);
        dispatchMenuCommand(command, view);
    } catch (error) {
        console.error(`Error executing command: ${error}`);
    }
};

export const createActionBarInteractionPlugin = (
    menuCommandFactory: MenuCommandFactory
) => {
    return new Plugin({
        key: actionBarInteractionPluginKey,
        props: {
            handleDOMEvents: {
                actionBarItemClick: (view, event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const { value } = event.detail;

                    executeMenuCommand(menuCommandFactory, view, value);

                    return true;
                },
                saveLinkMenu: (view, event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const { type, link } = event.detail;

                    executeMenuCommand(menuCommandFactory, view, type, {
                        link: link,
                    });

                    return true;
                },
                saveHighlightMenu: (view, event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const { type, color } = event.detail;

                    executeMenuCommand(menuCommandFactory, view, type, {
                        color: color,
                    });

                    return true;
                },
            },
        },
    });
};
