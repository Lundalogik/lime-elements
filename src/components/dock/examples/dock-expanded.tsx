import { Component, h, State } from '@stencil/core';
import { DockItem } from '@limetech/lime-elements';

/**
 * Basic Example expanded
 */
@Component({
    tag: 'limel-example-dock-expanded',
    shadow: true,
    styleUrl: 'dock-basic.scss',
})
export class DockExpandedExample {
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
            dockMenu: { componentName: 'my-custom-menu' },
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
            id: 'create',
            label: 'Create object',
            icon: 'plus_math',
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
                    accessibleLabel="Dock Example: expanded"
                    dockItems={this.dockItems}
                    dockFooterItems={this.dockFooterItems}
                    onItemSelected={this.handleSelected}
                    allowResize={false}
                    expanded={true}
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
