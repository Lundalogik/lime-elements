import { Plugin, PluginKey } from 'prosemirror-state';
import { MenuCommandFactory } from '../menu/menu-commands';
import { EditorMenuTypes } from '../menu/types';

export const actionBarInteractionPluginKey = new PluginKey(
    'actionBarInteractionPlugin',
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

export const createActionBarInteractionPlugin = (
    menuCommandFactory: MenuCommandFactory,
) => {
    return new Plugin({
        key: actionBarInteractionPluginKey,
        props: {
            handleDOMEvents: {
                actionBarItemClick: (view, event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const { value } = event.detail;

                    try {
                        const command = menuCommandFactory.getCommand(value);
                        dispatchMenuCommand(command, view);
                    } catch (error) {
                        // eslint-disable-next-line no-console
                        console.error(`Error executing command: ${error}`);
                    }

                    return true;
                },
                saveLinkMenu: (view, event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const { type, link } = event.detail;

                    if (type === EditorMenuTypes.Link) {
                        try {
                            const command = menuCommandFactory.getCommand(
                                type,
                                link,
                            );
                            dispatchMenuCommand(command, view);
                        } catch (error) {
                            // eslint-disable-next-line no-console
                            console.error(`Error executing command: ${error}`);
                        }
                    }

                    return true;
                },
            },
        },
    });
};
