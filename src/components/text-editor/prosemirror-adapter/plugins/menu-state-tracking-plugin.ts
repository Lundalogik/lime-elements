import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { CommandWithActive, MenuCommandFactory } from '../menu/menu-commands';
import { EditorMenuTypes } from '../menu/types';

export const actionBarPluginKey = new PluginKey('actionBarPlugin');

export type UpdateMenuItemsCallBack = (
    activeTypes: Record<EditorMenuTypes, boolean>,
) => void;

const getMenuItemStates = (
    menuTypes: EditorMenuTypes[],
    menuCommandFactory: MenuCommandFactory,
    view: EditorView,
): Record<EditorMenuTypes, boolean> => {
    const activeTypes: Record<EditorMenuTypes, boolean> = {};

    menuTypes.forEach((type) => {
        const command: CommandWithActive = menuCommandFactory.getCommand(type);
        activeTypes[type] =
            command && command.active && command.active(view.state);
    });

    return activeTypes;
};

export const createMenuStateTrackingPlugin = (
    menuTypes: EditorMenuTypes[],
    menuCommandFactory: MenuCommandFactory,
    updateCallback: UpdateMenuItemsCallBack,
) => {
    return new Plugin({
        key: actionBarPluginKey,
        view: () => ({
            update: (view) => {
                const menuItemStates = getMenuItemStates(
                    menuTypes,
                    menuCommandFactory,
                    view,
                );
                updateCallback(menuItemStates);
            },
        }),
    });
};
