import { Component, h, State } from '@stencil/core';
import { DockItem } from '@limetech/lime-elements';

/**
 * Basic Example
 *
 * The Dock component can be used as a place for displaying the app's
 * primary navigation.
 *
 * :::important
 * Avoid having too many items in the Dock, because it will become
 * problematic on mobile devices, when the component is rendered horizontally.
 * :::
 *
 * It is possible to split the dock items into two sections and place one or
 * more items at the bottom of the column. To do so, you can use `isFooterStart`
 * on one of the items, which will act as a separator between the two sections,
 * pushing itself and preceding to the bottom.
 *
 * :::important
 * You must provide `label`s for to improve accesibility! Without labels,
 * screen-readers cannot tell visually impared persons about the content
 * of the Dock.
 * :::
 *
 * It is possible to add extra information about the items using `helperLabel`.
 *
 * When the component is expanded, only the `helpeLabel` is used
 * in the tooltip, when items are hovered.
 * When the component is shrunk, both `label` and `helperLabel` are displayed
 * inside the tooltip.
 *
 * Keep in mind that on a mobile phone, the component will be displayed horizontally
 * and no labels are displayed! Instead, both `label` and `helperLabel` will be used
 * as a tooltip to improve accessibility for screen-reader technologies.
 *
 * However, since hovering is not possible on touch-only mobile devices, users who
 * rely on their vision to navigate the app will only see your chosen icons.
 * So pick them carefully.
 *
 */
@Component({
    tag: 'limel-example-dock-basic',
    shadow: true,
    styleUrl: 'dock-basic.scss',
})
export class DockBasicExample {
    @State()
    private dockItems: DockItem[] = [
        {
            id: 'home',
            label: 'Lime',
            helperLabel: 'Cmd + H',
            selected: true,
            icon: '-lime-logo-outlined-colored',
        },
        {
            id: 'tables',
            label: 'Tables',
            icon: 'insert_table',
        },
        {
            id: 'search',
            label: 'Search',
            icon: 'search',
        },
    ];

    @State()
    private dockFooterItems: DockItem[] = [
        {
            id: 'user',
            label: 'Preferences',
            icon: 'user',
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: 'settings',
        },
    ];

    public render() {
        return (
            <div class="application">
                <limel-dock
                    accessibleLabel="Dock Example: basic dock"
                    dockItems={this.dockItems}
                    dockFooterItems={this.dockFooterItems}
                    onItemSelected={this.handleSelected}
                />
            </div>
        );
    }

    private handleSelected = (event: CustomEvent<DockItem>) => {
        const setSelection = (item: DockItem) => {
            return {
                ...item,
                selected: item.id === event.detail.id,
            };
        };

        this.dockItems = this.dockItems.map(setSelection);
        this.dockFooterItems = this.dockFooterItems.map(setSelection);
    };
}
