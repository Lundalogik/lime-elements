import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { isEqual } from 'lodash-es';

import { CommandWithActive, MenuCommandFactory } from '../menu/menu-commands';
import { EditorMenuTypes } from '../menu/types';

export const actionBarPluginKey = new PluginKey('actionBarPlugin');

export interface ActiveMenuItems {
    active: Record<EditorMenuTypes, boolean>;
    allowed: Record<EditorMenuTypes, boolean>;
}

export type UpdateMenuItemsCallBack = (
    activeTypes: Record<EditorMenuTypes, boolean>,
    allowedTypes: Record<EditorMenuTypes, boolean>,
) => void;

export const getMenuItemStates = (
    menuTypes: EditorMenuTypes[],
    menuCommandFactory: MenuCommandFactory,
    view: EditorView,
): ActiveMenuItems => {
    const activeTypes: Record<EditorMenuTypes, boolean> = {};
    const allowedTypes: Record<EditorMenuTypes, boolean> = {};

    menuTypes.forEach((type) => {
        const command: CommandWithActive = menuCommandFactory.getCommand(type);
        activeTypes[type] = !!command?.active?.(view.state) || false;
        allowedTypes[type] = !!(command?.allowed?.(view.state) ?? true);
    });

    return { active: activeTypes, allowed: allowedTypes };
};

export const createMenuStateTrackingPlugin = (
    menuTypes: EditorMenuTypes[],
    menuCommandFactory: MenuCommandFactory,
    updateCallback: UpdateMenuItemsCallBack,
) => {
    return new Plugin<ActiveMenuItems>({
        key: actionBarPluginKey,
        state: {
            init: () => {
                return { active: {}, allowed: {} };
            },
            apply: (tr, menuStates) => {
                const newMenuStates = tr.getMeta(actionBarPluginKey);

                return newMenuStates ? newMenuStates : menuStates;
            },
        },
        view: () => ({
            update: (view) => {
                const oldItemStates = actionBarPluginKey.getState(view.state);
                const menuItemStates = getMenuItemStates(
                    menuTypes,
                    menuCommandFactory,
                    view,
                );
                if (!isEqual(oldItemStates, menuItemStates)) {
                    const tr = view.state.tr.setMeta(
                        actionBarPluginKey,
                        menuItemStates,
                    );
                    view.dispatch(tr);
                    updateCallback(
                        menuItemStates.active,
                        menuItemStates.allowed,
                    );
                }
            },
        }),
    });
};
