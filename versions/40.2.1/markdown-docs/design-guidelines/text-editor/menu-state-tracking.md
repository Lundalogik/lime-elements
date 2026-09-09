## Prosemirror Plugins

Prosemirror provides a comprehensive plugin system that is powerful and allows for seamless distribution of handling Editor functionality. The Editor Props interface is a configuration object that can be passed to an editor view. We make use of this within a plugin. Read documentation [here](https://prosemirror.net/docs/ref/version/0.20.0.html#view.EditorProps) about supported properties and the various event-handling functions available.

Here we provide an example of how we've created and implemented our own plugin to handle tracking of menu items.

##### Menu State Tracking
Tracking the state of the Editor menu is essential for maintaining an accurate and responsive toolbar. This is handled using a ProseMirror plugin and a simple callback function. The plugin monitors active menu items and updates the ActionBar accordingly.

- Tracks active menu items and updates the toolbar accordingly.

1. **getMenuItemStates Function**:
    - Purpose: Retrieve the active state of each menu item.
    - Parameters:
        - `menuTypes`: An array of `EditorMenuTypes` representing the types of menu items.
        - `menuCommandFactory`: An instance of `MenuCommandFactory` to fetch commands. We use this to get the active state of the command related to the menu type. We've extended the basic ProseMirror Command with an active method that determines if a specific mark or node type is active in the current editor selection. For more information [read here](./menu-command.md)
        - `view`: The current `EditorView` instance.
    - Returns: An object mapping `EditorMenuTypes` to their active states (true/false).

    ```typescript
    const getMenuItemStates = (
        menuTypes: EditorMenuTypes[],
        menuCommandFactory: MenuCommandFactory,
        view: EditorView,
    ): ActiveMenuItems => {
        const activeTypes: ActiveMenuItems = {};

        menuTypes.forEach((type) => {
            const command: CommandWithActive = menuCommandFactory.getCommand(type);
            activeTypes[type] =
                command && command.active && command.active(view.state);
        });

        return activeTypes;
    };
    ```

2. **createMenuStateTrackingPlugin Function**:
    - Purpose: Create a ProseMirror plugin to track and update menu item states.
    - Parameters:
        - `menuTypes`: An array of `EditorMenuTypes` to track.
        - `menuCommandFactory`: The factory to fetch commands.
        - `updateCallback`: A callback function to update the toolbar with new states.
    - Returns: A ProseMirror plugin instance.

    ```typescript
    export const createMenuStateTrackingPlugin = (
        menuTypes: EditorMenuTypes[],
        menuCommandFactory: MenuCommandFactory,
        updateCallback: UpdateMenuItemsCallBack,
    ) => {
        return new Plugin<ActiveMenuItems>({
            key: actionBarPluginKey,
            state: {
                init: () => {
                    return {};
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
                        updateCallback(menuItemStates);
                    }
                },
            }),
        });
    };
    ```

3. **Plugin Initialization**:
    - Integrate the menu state tracking plugin within the `createEditorState` function in the ProseMirror adapter.
    - Pass the necessary parameters including the callback function.

    ```typescript
    createMenuStateTrackingPlugin(
        editorMenuTypesArray,
        this.menuCommandFactory,
        this.updateActiveActionBarItems,
    ),
    ```

4. **updateActiveActionBarItems Callback Function**:
    - Purpose: Update the toolbar with the new active menu item states.
    - Parameters: `activeTypes` - An object mapping `EditorMenuTypes` to their active states.
    - Functionality: Maps over the toolbar items, updates their selected state, and assigns the new items to `this.actionBarItems`.

    ```typescript
    private updateActiveActionBarItems = (
        activeTypes: Record<EditorMenuTypes, boolean>,
    ) => {
        const newItems = getTextEditorMenuItems().map((item) => {
            if (isItem(item)) {
                return {
                    ...item,
                    selected: activeTypes[item.value],
                };
            }

            return item;
        });

        this.actionBarItems = newItems;
    };
    ```

[back to main document](editor-development.md#the-menu-command-factory)
